const { Op } = require("sequelize");

// Utils
const { getMediaUrl } = require("../../lib/utils");
const DateTime = require("../../lib/dateTime");

// Services
const shopifyService = require("./shopify");
const productImageService = require("./productImageService");
const storeProductMediaService = require("./storeProductMediaService");

const { STORE_PRODUCT_EXPORT_STATUS_PENDING } = requiire("../../helpers/StoreProduct");

const { store_product, product_media, product, Location } = require("../../db").models;

/**
 * Check whether Location product exist or not by name
 *
 * @param {*} store_id
 * @param {*} product_id
 * @returns {*} false if not exist else details
 */
const isExist = async (store_id, product_id) => {
    if (!store_id) {
        throw { message: "Location id is required" };
    }

    if (!product_id) {
        throw { message: "Product id is required" };
    }

    const storeProductDetails = await store_product.findOne({
        where: { store_id, product_id },
    });

    if (!storeProductDetails) {
        return false;
    }

    return storeProductDetails.get();
};

/**
 * Check whether Location product exist or not by id
 *
 * @param {*} id
 * @returns {*} false if not exist else details
 */
const isExistById = async id => {
    if (!id) {
        throw { message: "Location product id is required" };
    }

    const storeProductDetails = await store_product.findOne({
        where: { id },
        include: [
            {
                required: true,
                model: product,
                as: "product",
                attributes: ["id", "name", "slug"],
            },
            
            {
                required: true,
                model: Location,
                as: "location",
                attributes: {
                    exclude: [
                        "shopify_password",
                        "createdAt",
                        "updatedAt",
                        "deletedAt",
                    ],
                },
            },
        ],
    });

    if (!storeProductDetails) {
        return false;
    }

    return storeProductDetails.get();
};

/**
 *  Create location product
 *
 * @param {*} data
 */
const createStoreProduct = async data => {
    if (!data) {
        throw { message: "Location product details is required" };
    }

    const storeProduct = await isExist(data.storeId, data.productId);

    if (storeProduct) {
        throw { message: "Location product already exist" };
    }

    const createData = {
        product_id: data.productId,
        store_id: data.storeId,
    };

    const storeProductDetails = await store_product.create(createData);

    return storeProductDetails;
};

/**
 * Update location product
 *
 * @param {*} store_id
 * @param {*} product_id
 * @param {*} data
 */
const updateStoreProduct = async (store_id, product_id, data) => {
    const storeProductDetails = await isExist(store_id, product_id);

    if (!storeProductDetails) {
        throw { message: "Location product not found" };
    }

    // Update data
    const updateData = {
        product_id: data.productId,
        store_id: data.storeId,
    };

    const save = await store_product.update(updateData, {
        where: { store_id, product_id },
        returning: true,
        plain: true,
    });

    return save;
};

/**
 * Update all the location product associated with product_id
 *
 * @param {*} product_id
 * @param {*} data
 */
const updateAllStoreProductByProductId = async (product_id, data) => {
    const storeProductDetails = await getStoreProductByProductId(product_id);

    if (!storeProductDetails.count) {
        return null;
    }

    storeProductDetails.rows.forEach(async storeProduct => {
        const updateData = {
            product_id: data.productId,
            store_id: data.storeId,
        };

        await store_product.update(updateData, {
            where: { id: storeProduct.id },
        });
    });
};

/**
 * Update location product by id
 *
 * @param {*} id
 * @param {*} data
 */
const updateStoreProductById = async (id, data) => {
    if (!data.storeId) {
        throw { message: "Location id is required" };
    }

    if (!data.productId) {
        throw { message: "Product id is required" };
    }

    const storeProductDetails = await isExistById(id);

    if (!storeProductDetails) {
        throw { message: "Location product not found" };
    }

    // Validate location product if already exist
    const where = {
        id: { $ne: id },
        store_id: data.storeId,
        product_id: data.productId,
    };
    const existStoreProduct = await store_product.count({ where });

    if (existStoreProduct) {
        throw { message: "Location product is already exist" };
    }

    // Update data
    const updateData = {
        product_id: data.productId,
        store_id: data.storeId,
    };

    const save = await store_product.update(updateData, {
        where: { id },
        returning: true,
        plain: true,
    });

    return save;
};

/**
 * Delete location product
 *
 * @param {*} store_id
 * @param {*} product_id
 */
const deleteStoreProduct = async (store_id, product_id) => {
    const storeProductDetails = await isExist(store_id, product_id);

    if (!storeProductDetails) {
        throw { message: "Location product not found" };
    }

    await store_product.destroy({
        where: { store_id, product_id },
    });

    storeProductDetails.product_id &&
        shopifyService.deleteProduct(
            store_id,
            storeProductDetails.product_id,
            () => {}
        );
};

/**
 * Delete location product by id
 *
 * @param {*} id
 */
const deleteStoreProductById = async id => {
    const storeProductDetails = await isExistById(id);

    if (!storeProductDetails) {
        throw { message: "Location product not found" };
    }

    await store_product.destroy({
        where: { id },
    });

    storeProductDetails.product_id &&
        shopifyService.deleteProduct(
            storeProductDetails.store_id,
            storeProductDetails.product_id,
            () => {}
        );
};

/**
 * Get all location product details by product_id
 *
 * @params product_id
 */
const getStoreProductByProductId = async product_id => {
    if (!product_id) {
        throw { message: "Product id is required" };
    }

    const storeProducts = await store_product.findAndCountAll({
        where: { product_id },
    });

    return storeProducts;
};

/**
 * Get location product details by store_id and product_id
 *
 * @params store_id
 * @params product_id
 */
const getStoreProductByStoreAndProductId = async (store_id, product_id) => {
    if (!store_id) {
        throw { message: "Location id is required" };
    }

    if (!product_id) {
        throw { message: "Product id is required" };
    }

    const storeProducts = await store_product.findOne({
        where: { store_id, product_id },
    });

    return storeProducts;
};

/**
 * Get all location products by id
 *
 * @param ids - Array
 * @param options add more where condition option: {objectType}
 */
const getAllStoreProductById = async (ids, options) => {
    if (!ids) {
        throw { message: "Product id is required" };
    }

    const storeProducts = await store_product.findAndCountAll({
        where: { id: { [Op.in]: ids }, ...options },
    });

    return storeProducts;
};

/**
 * Search location product
 *
 * @param {*} params
 */
const searchStoreProduct = async params => {
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
        throw { message: `Unable to sort location by ${sortParam}` };
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
            {
                "$location.name$": {
                    $like: `%${searchTerm}%`,
                },
            },
        ];
    }

    // Search by product id
    if (productId) {
        where.product_id = productId;
    }

    // Search by product id
    if (params.store_id) {
        where.store_id = params.store_id;
    }

    const query = {
        distinct: true,
        attributes: { exclude: ["deletedAt"] },
       
        where,
        include: [
            {
                required: true,
                model: product,
                as: "product",
                attributes: ["id", "name"],
            },
            
            {
                required: true,
                model: Location,
                as: "location",
                attributes: {
                    exclude: [
                        "shopify_password",
                        "createdAt",
                        "updatedAt",
                        "deletedAt",
                    ],
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

    // Get location list and count
    const storeProducts = await store_product.findAndCountAll(query);

    // Return location is null
    if (storeProducts.count === 0) {
        return null;
    }

    const storeProductData = [];

    storeProducts.rows.forEach(storeProduct => {
        const {
            id,
            product_id,
            store_id,
            product,
            location,
            createdAt,
            updatedAt,
        } = storeProduct;
        const data = { ...storeProduct.get() };

       
        if (product_id && product) {
            data.productName = product.name;
        }

        if (store_id && location) {
            data.locationName = location.name;
        }
        
        data.createdAt = DateTime.shortDateAndTime(createdAt);
        data.updatedAt = DateTime.shortDateAndTime(updatedAt);
        data.updatedAt = DateTime.shortDateAndTime(updatedAt);

        storeProductData.push(data);
    });

    return {
        totalCount: storeProducts.count,
        currentPage: page,
        pageSize,
        data: storeProductData,
        sort,
        sortDir,
        search,
        store_id: params.store_id,
    };
};

/**
 * Get location product details by id
 *
 * @param {*} storeProductId
 */
const getStoreProductDetails = async storeProductId => {
    const storeProductDetails = await isExistById(storeProductId);

    if (!storeProductDetails) {
        throw { message: "Location product not found" };
    }

    const {
        id,
        product_id,
        store_id,
        product,
        location,
        createdAt,
        updatedAt,
    } = storeProductDetails;
    const data = {
        id,
        product_id,
        store_id,
    };

   

    if (product_id && product) {
        data.productName = product.name;
    }

    if (store_id && location) {
        data.locationName = location.name;
    }
    
    data.createdAt = DateTime.shortDateAndTime(createdAt);
    data.updatedAt = DateTime.shortDateAndTime(updatedAt);
    data.slug = product.slug;

    return data;
};

module.exports =  {
    isExist,
    createStoreProduct,
    updateStoreProduct,
    updateStoreProductById,
    updateAllStoreProductByProductId,
    searchStoreProduct,
    deleteStoreProduct,
    deleteStoreProductById,
    getAllStoreProductById,
    getStoreProductByProductId,
    getStoreProductDetails,
    getStoreProductByStoreAndProductId,
};
