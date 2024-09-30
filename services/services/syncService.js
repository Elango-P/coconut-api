// Util
const DateTime = require("../../lib/dateTime");

const { sync } = require("../../db").models;

/**
 * Check whether sync exist or not by object_id
 * and object_name
 *
 * @param {*} objectId
 * @param {*} ObjectName
 * @param {*} name
 * @returns {*} false if not exist else details
 */
const isExistByObjectId = async (objectId, objectName, name) => {
    if (!objectId) {
        throw { message: "Sync object id is required" };
    }

    if (!objectName) {
        throw { message: "Sync object name is required" };
    }

    if (!name) {
        throw { message: "Sync name is required" };
    }

    const syncDetails = await sync.findOne({
        where: { object_id: objectId, object_name: objectName, name },
    });

    if (!syncDetails) {
        return false;
    }

    return syncDetails.get();
};

/**
 *  Create sync
 *
 * @param {*} data
 */
const createSync = async data => {
    const createData = {
        name: data.name,
        object_name: data.objectName,
        object_id: data.objectId,
        status: data.status,
        result: data.result,
    };

    const syncData = await sync.create(createData);

    return syncData;
};

/**
 * Update sync by object_id and object_name
 *
 * @param {*} objectId
 * @param {*} objectName
 * @param {*} name
 * @param {*} data
 */
const updateSyncByObjectId = async (objectId, objectName, name, data) => {
    if (!objectId) {
        throw { message: "Sync object id is required" };
    }

    if (!objectName) {
        throw { message: "Sync object name is required" };
    }

    if (!name) {
        throw { message: "Sync name is required" };
    }

    const syncDetails = await isExistByObjectId(objectId, objectName, name);

    if (!syncDetails) {
        throw { message: "Sync not found" };
    }

    const updateData = {
        name: data.name,
        object_name: data.objectName,
        object_id: data.objectId,
        status: data.status,
        result: data.result,
    };

    const save = await sync.update(updateData, {
        where: { object_id: objectId, object_name: objectName, name },
    });

    return save;
};

/**
 * Delete sync object
 *
 * @param {*} objectId
 * @param {*} objectName
 * @param {*} name
 */
const deleteSyncObject = async (objectId, objectName, name) => {
    if (!objectId) {
        throw { message: "Sync object id is required" };
    }

    if (!objectName) {
        throw { message: "Sync object name is required" };
    }

    if (!name) {
        throw { message: "Sync name is required" };
    }

    const syncDetails = await isExistByObjectId(objectId, objectName, name);

    if (!syncDetails) {
        throw { message: "Sync object not found" };
    }

    return await sync.destroy({ where: { id: syncDetails.id } });
};

/**
 * Search sync
 *
 * @param {*} params
 */
const searchSync = async params => {
    let { page, pageSize, search, sort, sortDir, pagination, status } = params;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
        throw { message: "Invalid page" };
    }

    // Search in any page
    page = search ? 1 : page;

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
        objectName: "object_name",
        objectId: "object_id",
        status: "status",
        result: "result",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "updatedAt";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort sync by ${sortParam}` };
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
                name: {
                    $like: `%${searchTerm}%`,
                },
            },
            {
                object_name: {
                    $like: `%${searchTerm}%`,
                },
            },
            {
                result: {
                    $like: `%${searchTerm}%`,
                },
            },
        ];
    }

    // Filter by status
    if (status) {
        where.status = status;
    }

    // Filter by name
    if (params.name) {
        where.name = params.name;
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

    // Get sync list and count
    const syncDetails = await sync.findAndCountAll(query);

    // Return sync is null
    if (syncDetails.count === 0) {
        return null;
    }

    const syncData = [];

    syncDetails.rows.forEach(syncDetail => {
        const { createdAt, updatedAt } = syncDetail;
        const data = { ...syncDetail.get() };

        // formate object property
        data.createdAt = DateTime.shortDateAndTime(createdAt);
        data.updatedAt = DateTime.shortDateAndTime(updatedAt);

        syncData.push(data);
    });

    return {
        totalCount: syncDetails.count,
        currentPage: page,
        pageSize,
        data: syncData,
        sort,
        sortDir,
    };
};

module.exports = {
    createSync,
    deleteSyncObject,
    isExistByObjectId,
    updateSyncByObjectId,
    searchSync,
};
