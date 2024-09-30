const { Inventory, product, account } = require("../db").models;

const { Op } = require("sequelize");

// Utils
const  DateTime= require( "../lib/dateTime");
/**
 *  Create inventory
 *
 * @param {*} data
 */
const createInventory = async (data, companyId) => {
    try {
   
    if (!data) {
        throw { message: "Inventory details is required" };
    }

    const createData = {
        product_id: data.productId,
        vendor_id: data.vendorId,
        price: data.price,
        quantity: data.quantity,
        date: data.date,
        device_id : "",
        company_id: companyId
    };

    const inventorytDetails = await Inventory.create(createData);

    return inventorytDetails;
         
} catch (err) {
        console.log(err);
}
};

/**
 * Check whether Inventory exist or not by id
 *
 * @param {*} id
 * @returns {*} false if not exist else details
 */
const isExistById = async id => {
    try {
   
    if (!parseInt(id)) {
        throw { message: "Inventory id is required" };
    }

    const inventoryDetails = await Inventory.findOne({
        where: { id },
        include: [
            {
                required: true,
                model: product,
                as: "product",
                attributes: ["id", "name"],
            },
            {
                required:false,
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
         
} catch (err) {
        console.log(err);
}
};

/**
 * Get inventory details by id
 *
 * @param {*} inventoryId
 */
const getInventoryDetails = async inventoryId => {
    try {
        
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
        data.supplierName = account.name;
    }
    // formate object property
    data.date = date ? date : "";
    data.createdAt = DateTime.shortDateAndTime(createdAt);
    data.updatedAt = DateTime.shortDateAndTime(updatedAt);

    return data;
} catch (err) {
        console.log(err);
}
};

/**
 * Search inventory
 *
 * @param {*} params
 */
const searchInventory = async (params, companyId) => {
    try {

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
        product_id:"product_id",
        quantity : "quantity",
        created_at: "created_at",
        updatedAt: "updated_at",
    };

    const sortParam = sort || "created_at";
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

    where.company_id = companyId;

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where[Op.or] = [
            {
                "$product.name$": {
                    [Op.iLike]: `%${searchTerm}%`,
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
                required: false,
                model: product,
                as: "product",
                attributes: ["id", "name"],
            },
            {
                required: false,
                model: account,
                as: "account",
                attributes: {
                    exclude: ["created_at", "updated_at", "deleted_at"],
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
    const inventories = await Inventory.findAndCountAll(query);

    // Return inventory list is null
    if (inventories.count === 0) {
        return {};
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
            data.supplierName = account.name;
        }
        // formate object property
        data.date = DateTime.shortDate(date);
        data.createdAt = DateTime.shortDateAndTime(createdAt);
        data.updatedAt = DateTime.shortDateAndTime(updatedAt);

        inventoryList.push(data);
    });

    // sorting the product name based on product_id
    if (sort == "product_id") {
        if (sortDirParam == "DESC") {
            inventoryList.sort((a, b) =>
                a.productName < b.productName ? 1 : -1
            );
        };
        if (sortDirParam == "ASC") {
            inventoryList.sort((a, b) =>
                a.productName > b.productName ? 1 : -1
            );
        };
    };

    return {
        totalCount: inventories.count,
        currentPage: page,
        pageSize,
        data: inventoryList,
        sort,
        sortDir,
        search,
    };
} catch (err) {
        console.log(err);
}
};

/**
 * Delete inventory product
 *
 * @param {*} inventoryId
 */
const deleteInventory = async inventoryId => {
    try {
  
    const inventoryDetails = await isExistById(inventoryId);

    if (!inventoryDetails) {
        throw { message: "Inventory not found" };
    }

    return await Inventory.destroy({
        where: { id: inventoryId },
    });
          
} catch (err) {
       console.log(err); 
}
};

module.exports = {
    searchInventory,
    getInventoryDetails,
    createInventory,
    deleteInventory,
};
