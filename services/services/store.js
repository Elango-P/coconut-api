// Models
const { Location } = require("../../db").models;
// Util
const DateTime = require("../../lib/dateTime");

/**
 * Check whether Location exist or not by name
 *
 * @param {*} name
 * @returns {*} false if not exist else details
 */
const isExistByName = async name => {
    if (!name) {
        throw { message: "Location name is required" };
    }

    const locationDetails = await Location.findOne({
        where: { name },
    });

    if (!locationDetails) {
        return false;
    }

    return locationDetails.get();
};

/**
 * Check whether Location exist or not by id
 *
 * @param {*} id
 * @returns {*} false if not exist else details
 */
const isExistById = async id => {
    if (!parseInt(id)) {
        throw { message: "Location id is required" };
    }

    const locationDetails = await Location.findOne({
        where: { id },
    });

    if (!locationDetails) {
        return false;
    }

    return locationDetails.get();
};

/**
 *  Create Location
 *
 * @param {*} data
 */
const createStore = async data => {
    const createData = {
        name: data.name,
    };

    const locationData = await Location.create(createData);

    return locationData;
};

/**
 * Get Location details by storeId
 *
 * @param {*} storeId
 */
const getLocationDetails = async storeId => {
    const locationDetails = await isExistById(storeId);

    if (!locationDetails) {
        throw { message: "Location not found" };
    }

    const {
        id,
        name,
        shopify_store_name,
        shopify_admin_api_version,
        shopify_api_key,
        shopify_password,
        createdAt,
        updatedAt,
    } = locationDetails;

    const data = {
        id,
        name,
        shopifyStoreName: shopify_store_name ? shopify_store_name : "",
        shopifyAdminApiVersion: shopify_admin_api_version
            ? shopify_admin_api_version
            : "",
        shopifyApiKey: shopify_api_key ? shopify_api_key : "",
        shopifyPassword: shopify_password ? shopify_password : "",
    };

    // formate object property
    data.createdAt = DateTime.shortDateAndTime(createdAt);
    data.updatedAt = DateTime.shortDateAndTime(updatedAt);

    return data;
};

/**
 * Update Location details by storeId
 *
 * @param {*} storeId
 * @param {*} data
 */
const updateStoreById = async (storeId, data) => {
    const locationDetails = await isExistById(storeId);

    if (!locationDetails) {
        throw { message: "Location not found" };
    }

    const {
        name,
        shopifyStoreName,
        shopifyAdminApiVersion,
        shopifyApiKey,
        shopifyPassword,
    } = data;

    // Update data
    const updateData = {
        name,
        shopify_store_name: shopifyStoreName,
        shopify_admin_api_version: shopifyAdminApiVersion,
        shopify_api_key: shopifyApiKey,
        shopify_password: shopifyPassword,
    };

    const save = await Location.update(updateData, {
        where: { id: storeId },
    });

    return save;
};

/**
 * Search Location
 *
 * @param {*} params
 */
const searchStore = async params => {
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
        id: "id",
        name: "name",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "name";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort Location by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
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

    // Get Location list and count
    const locationDetails = await Location.findAndCountAll(query);

    // Return Location is null
    if (locationDetails.count === 0) {
        return null;
    }

    const locationData = [];

    locationDetails.rows.forEach(storeDetail => {
        const {
            id,
            name,
            shopify_store_name,
            shopify_admin_api_version,
            shopify_api_key,
            createdAt,
            updatedAt,
        } = storeDetail;

        const data = {
            id,
            name,
            shopifyStoreName: shopify_store_name ? shopify_store_name : "",
            shopifyAdminApiVersion: shopify_admin_api_version
                ? shopify_admin_api_version
                : "",
            shopifyApiKey: shopify_api_key ? shopify_api_key : "",
        };

        // formate object property
        data.createdAt = DateTime.shortDateAndTime(createdAt);
        data.updatedAt = DateTime.shortDateAndTime(updatedAt);

        locationData.push(data);
    });

    return {
        totalCount: locationDetails.count,
        currentPage: page,
        pageSize,
        data: locationData,
        sort,
        sortDir,
    };
};

/**
 * Get Location details by storeId
 *
 * @param {*} storeId
 */
const deleteStore = async storeId => {
    const locationDetails = await isExistById(storeId);

    if (!locationDetails) {
        throw { message: "Location not found" };
    }

    return await Location.destroy({ where: { id: storeId } });
};

module.exports = {
    createStore,
    isExistByName,
    isExistById,
    getLocationDetails,
    updateStoreById,
    searchStore,
    deleteStore,
};
