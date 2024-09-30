const DateTime = require("../../lib/dateTime");
const { getMediaUrl } = require("../../lib/utils");

const { PRODUCT_IMAGE_STATUS_ACTIVE } = require("../../helpers/ProductImage");

const { order_product, store_product } = require("../../db").models;


/**
 * Create order product
 *
 * @param data
 */
const createOrderProduct = async data => {
    if (!data) {
        throw { message: "Order product details required" };
    }

    const createData = {
        store_product_id: data.storeProductId,
        order_id: data.orderId,
        name: data.name,
        quantity: data.quantity,
        sku: data.sku,
        vendor: data.vendor,
        fulfillment_service: data.fulfillmentService,
        requires_shipping: data.requiresShipping,
        taxable: data.taxable,
        grams: data.grams,
        price: data.price,
        total_discount: data.totalDiscount,
        fulfillment_status: data.fulfillmentStatus,
    };

    await order_product.create(createData);
};

/**
 * Search order
 *
 * @param {*} params
 */
const searchOrderProduct = async params => {
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
        store_product_id: "store_product_id",
        name: "name",
        quantity: "quantity",
        vendor: "vendor",
        fulfillment_service: "fulfillment_service",
        requires_shipping: "requires_shipping",
        taxable: "taxable",
        grams: "grams",
        price: "price",
        total_discount: "total_discount",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "name";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort product by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        throw { message: "Invalid sort order" };
    }

    const data = params;

    let where = {};
    let storeProductCondition = {};

    // Filter by order_id
    if (data.orderId && data.store_id) {
        where.order_id = data.orderId;
        storeProductCondition.store_id = data.store_id;
    }

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where.$or = [
            {
                name: {
                    $like: `%${searchTerm}%`,
                },
                vendor: {
                    $like: `%${searchTerm}%`,
                },
            },
        ];
    }

    const query = {
        distinct: true,
        attributes: { exclude: ["deletedAt"] },
        order: [[sortableFields[sortParam], sortDirParam]],
        include: [
            {
                required: false,
                model: store_product,
                as: "storeProduct",
                where: storeProductCondition,
               
            },
        ],
        where,
    };

    if (pagination) {
        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }
    }

    // Get order product and count
    const orderProduct = await order_product.findAndCountAll(query);

    // Return order product is null
    if (orderProduct.count === 0) {
        return null;
    }

    const orderProductData = [];

    orderProduct.rows.forEach(product => {
        const { createdAt, updatedAt } = product;
        const orderProductDetails = { ...product.get() };

        const { storeProduct } = orderProductDetails;
        

        orderProductDetails.createdAt = DateTime.defaultDateFormat(createdAt);
        orderProductDetails.updatedAt = DateTime.defaultDateFormat(updatedAt);
        delete orderProductDetails.storeProduct;

        orderProductData.push(orderProductDetails);
    });

    return {
        totalCount: orderProduct.count,
        currentPage: page,
        pageSize,
        data: orderProductData,
        sort,
        sortDir,
        search,
    };
};

/**
 * Get all product by order_id
 *
 * @param orderId
 */
const getAllOrderProductByOrderId = async orderId => {
    if (!orderId) {
        throw { message: "Order id is required" };
    }

    const orderProducts = await order_product.findAndCountAll({
        where: { order_id: orderId },
    });

    return orderProducts;
};

/**
 * Delete order product by order id
 *
 * @param orderId
 */
const deleteOrderProductByOrderId = async orderId => {
    const orderProducts = await getAllOrderProductByOrderId(orderId);

    orderProducts.rows.forEach(async orderProduct => {
        await orderProduct.destroy();
    });
};

export default {
    createOrderProduct,
    searchOrderProduct,
    getAllOrderProductByOrderId,
    deleteOrderProductByOrderId,
};
