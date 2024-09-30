// Utils
const  DateTime= require("../../lib/dateTime");
// { shortDateAndTime, shortDate }
const { inventory, product, account  } = require("../../db").models;

/**
 *  Create inventory
 *
 * @param {*} data
 */
const createInventory = async data => {
    if (!data) {
        throw { message: "Inventory details is required" };
    }

    const createData = {
        product_id: data.productId,
        vendor_id: data.vendorId,
        price: data.price,
        quantity: data.quantity,
        date: data.date,
    };

    const inventorytDetails = await inventory.create(createData);

    return inventorytDetails;
};

/**
 * Check whether Inventory exist or not by id
 *
 * @param {*} id
 * @returns {*} false if not exist else details
 */
const isExistById = async id => {
    if (!parseInt(id)) {
        throw { message: "Inventory id is required" };
    }

    const inventoryDetails = await inventory.findOne({
        where: { id },
        include: [
            {
                required: true,
                model: product,
                as: "product",
                attributes: ["id", "name"],
            },
            {
                required: true,
                model: account,
                as: "account",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
            },
        ],
    });

    if (!inventoryDetails) {
        return false;
    }

    return inventoryDetails.get();
};

/**
 * Get inventory details by id
 *
 * @param {*} inventoryId
 */
const getInventoryDetails = async inventoryId => {
    const inventoryDetails = await isExistById(inventoryId);

    if (!inventoryDetails) {
        throw { message: "Inventory not found" };
    }

    const {
        id,
        date,
        product_id,
        vendor_id,
        product,
        account,
        price,
        quantity,
        createdAt,
        updatedAt,
    } = inventoryDetails;
    const data = {
        id,
        product_id,
        vendor_id,
        price,
        quantity,
    };

    if (product_id && product) {
        data.productName = product.name;
    }

    if (vendor_id && account) {
        data.vendorName = account.name;
    }
    // formate object property
    data.date = date ? date : "";
    data.createdAt = DateTime.shortDateAndTime(createdAt);
    data.updatedAt = DateTime.shortDateAndTime(updatedAt);

    return data;
};

/**
 * Search inventory
 *
 * @param {*} params
 */
const searchInventory = async params => {
    let {
        page,
        pageSize,
        search,
        sort,
        sortDir,
        pagination,
        productId,
    } = params;

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
        id: "id",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "createdAt";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort inventory by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        throw { message: "Invalid sort order" };
    }

    let where = {};

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where.$or = [
            {
                "$product.name$": {
                    $like: `%${searchTerm}%`,
                },
            },
        ];
    }

    // Search by product id
    if (productId) {
        where.product_id = productId;
    }

    const query = {
        distinct: true,
        attributes: { exclude: ["deletedAt"] },
        order: [[sortableFields[sortParam], sortDirParam]],
        where,
        include: [
            {
                required: true,
                model: product,
                as: "product",
                attributes: ["id", "name"],
            },
            {
                required: false,
                model: account,
                as: "account",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
            },
        ],
    };

    if (pagination) {
        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }
    }

    // Get inventory list and count
    const inventories = await inventory.findAndCountAll(query);

    // Return inventory list is null
    if (inventories.count === 0) {
        return null;
    }

    const inventoryList = [];

    inventories.rows.forEach(inventoryData => {
        const {
            id,
            date,
            product_id,
            vendor_id,
            product,
            account,
            createdAt,
            updatedAt,
        } = inventoryData;
        const data = { ...inventoryData.get() };

        if (product_id && product) {
            data.productName = product.name;
        }

        if (vendor_id && account) {
            data.vendorName = account.name;
        }
        // formate object property
        data.date = DateTime.shortDate(date);
        data.createdAt = DateTime.shortDateAndTime(createdAt);
        data.updatedAt = DateTime.shortDateAndTime(updatedAt);

        inventoryList.push(data);
    });

    return {
        totalCount: inventories.count,
        currentPage: page,
        pageSize,
        data: inventoryList,
        sort,
        sortDir,
        search,
    };
};

/**
 * Delete inventory product
 *
 * @param {*} inventoryId
 */
const deleteInventory = async inventoryId => {
    const inventoryDetails = await isExistById(inventoryId);

    if (!inventoryDetails) {
        throw { message: "Inventory not found" };
    }

    return await inventory.destroy({
        where: { id: inventoryId },
    });
};

export default {
    searchInventory,
    getInventoryDetails,
    createInventory,
    deleteInventory,
};
