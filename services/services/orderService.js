const DateTime = require("../../lib/dateTime");
//{ defaultDateFormat, shortDateAndTime }
// services
const shopifyService = require("./shopify");
const orderProductService = require("./orderProductService");

const {  order: orderModel, Location } = require("../../db").models;


/**
 * Get Location orders
 * @param storeId
 */
const getStoreOrders = async storeId => {
    const orders = await shopifyService.getOrder(storeId);
    return orders;
};

/**
 * Import Location orders in order table
 *
 * @param storeId
 */
const importOrders = async storeId => {
    if (!storeId) {
        throw { message: "Location id is required" };
    }

    const orders = await getStoreOrders(storeId);

    // Create each orders in order table
    for (let order of orders) {
        const createData = {
            orderNumber: order.order_number,
            storeOrderId: order.id,
            date: order.processed_at,
            total: order.total_price,
            storeId,
        };

        const orderDetails = await createOrder(createData);

        if (!orderDetails) continue;

        order.line_items.forEach(async item => {
            const itemCreateData = {
                storeProductId: item.product_id,
                orderId: orderDetails.id,
                name: item.name,
                quantity: item.quantity,
                sku: item.sku,
                vendor: item.vendor,
                fulfillmentService: item.fulfillment_service,
                requiresShipping: item.requires_shipping,
                taxable: item.taxable,
                grams: item.grams,
                price: item.price,
                totalDiscount: item.total_discount,
                fulfillmentStatus: item.fulfillment_status,
            };

            await orderProductService.createOrderProduct(itemCreateData);
        });
    }
};

/**
 * Create order
 *
 * @param data
 */
const createOrder = async data => {
    if (!data) {
        throw { message: "Order details required" };
    }

    // Validate order if already exist
    const orderExist = await orderModel.count({
        where: { order_number: data.orderNumber },
    });

    if (orderExist) {
        return null;
    }

    const createData = {
        order_number: data.orderNumber,
        store_order_id: data.storeOrderId,
        date: data.date,
        total: data.total,
        store_id: data.storeId,
    };

    return await orderModel.create(createData);
};

/**
 * Search order
 *
 * @param {*} params
 */
const searchOrder = async params => {
    let { page, pageSize, search, sort, sortDir, pagination } = params;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
        throw { message: "Invalid page" };
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
        throw { message: "Invalid page size" };
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
        store_order_id: "store_order_id",
        date: "date",
        total: "total",
        order_number: "order_number",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "order_number";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort product by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        throw { message: "Invalid sort order" };
    }

    const data = params;

    let where = {};

    // Search by Location id
    if (data.store_id) {
        where = { store_id: data.store_id };
    }

    // Search by name
    const name = data.name;
    if (name) {
        where.name = {
            $like: `%${name}%`,
        };
    }

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where.$or = [
            {
                name: {
                    $like: `%${searchTerm}%`,
                },
            },
        ];
    }

    const query = {
        attributes: { exclude: ["deletedAt"] },
        order: [[sortableFields[sortParam], sortDirParam]],
        where,
    };

    if (pagination) {
        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }
    }

    // Get Product image list and count
    const orders = await orderModel.findAndCountAll(query);

    // Return product image is null
    if (orders.count === 0) {
        return null;
    }

    const orderData = [];

    orders.rows.forEach(order => {
        const { createdAt, updatedAt } = order;

        const orderDetails = { ...order.get() };

        orderDetails.createdAt = DateTime.defaultDateFormat(createdAt);
        orderDetails.updatedAt = DateTime.defaultDateFormat(updatedAt);
        orderDetails.date = DateTime.shortDateAndTime(orderDetails.date);

        orderData.push(orderDetails);
    });

    return {
        totalCount: orders.count,
        currentPage: page,
        pageSize,
        data: orderData,
        sort,
        sortDir,
        search,
    };
};

/**
 * Check whether order exist or not
 *
 * @param orderId
 * @returns false if not exist else order details
 */
const isExistById = async orderId => {
    if (!orderId) {
        throw { message: "Order id is required" };
    }

    const orderDetails = await orderModel.findOne({ where: { id: orderId } });

    if (!orderDetails) {
        return false;
    }

    return orderDetails;
};

/**
 * Get order details by order id
 *
 * @param orderId
 */
const getOrdersById = async orderId => {
    const orderExist = await isExistById(orderId);

    if (!orderExist) {
        throw { message: "Order not found" };
    }

    const orderDetails = await orderModel.findOne({
        where: { id: orderId },
        include: [
            {
                required: true,
                model: Location,
                as: "location",
                attributes: ["id", "name"],
            },
        ],
    });

    return orderDetails;
};

/**
 * Delete order by id
 *
 * @param orderId
 */
const deleteOrder = async orderId => {
    const orderExist = await isExistById(orderId);

    if (!orderExist) {
        throw { message: "Order not found" };
    }

    await orderModel.destroy({
        where: { id: orderId },
    });

    await orderProductService.deleteOrderProductByOrderId(orderId);
};

/**
 * Update order by id
 *
 * @param {*} orderId
 * @param {*} data
 */
const updateOrder = async (orderId, data) => {
    if (!orderId) {
        throw { message: "Order id is required" };
    }

    if (!data) {
        throw { message: "Order details is required" };
    }

    // Validate order product if already exist
    const where = {
        id: { $ne: orderId },
        order_number: data.orderNumber,
    };
    const existOrderProduct = await orderModel.count({ where });
    console.log(existOrderProduct);
    if (existOrderProduct) {
        throw { message: "Order product already exist" };
    }

    const updateData = {
        order_number: data.orderNumber,
        store_order_id: data.storeOrderId,
        date: data.date,
        total: data.total,
        store_id: data.storeId,
    };

    await orderModel.update(updateData, { where: { id: orderId } });
};

export default {
    isExistById,
    getStoreOrders,
    getOrdersById,
    importOrders,
    createOrder,
    searchOrder,
    deleteOrder,
    updateOrder,
};
