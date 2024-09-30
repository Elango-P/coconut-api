// Models
const { apartment } = require("../../db").models;

// Util
const DateTime  = require("../../lib/dateTime");

/**
 * Check whether apartment exist or not by name
 *
 * @param {*} name
 * @returns {*} false if not exist else details
 */
const isExistByName = async name => {
    if (!name) {
        throw { message: "Apartment name is required" };
    }

    const apartmentDetails = await apartment.findOne({
        where: { name },
    });

    if (!apartmentDetails) {
        return false;
    }

    return apartmentDetails.get();
};

/**
 * Check whether apartment exist or not by id
 *
 * @param {*} id
 * @returns {*} false if not exist else details
 */
const isExistById = async id => {
    if (!parseInt(id)) {
        throw { message: "Apartment id is required" };
    }

    const apartmentDetails = await apartment.findOne({
        where: { id },
    });

    if (!apartmentDetails) {
        return false;
    }

    return apartmentDetails.get();
};

/**
 *  Create apartment
 *
 * @param {*} data
 */
const createApartment = async data => {
    if (!data.name) {
        throw { message: "Apartment name is required" };
    }

    // Validate apartment if already exist
    const apartmentExist = await apartment.count({
        where: { name: data.name },
    });

    if (apartmentExist) {
        throw { message: "Apartment is already exist" };
    }

    const createData = {
        name: data.name,
        status: data.status,
    };

    const apartmentData = await apartment.create(createData);

    return apartmentData;
};

/**
 * Get apartment details by apartmentId
 *
 * @param {*} apartmentId
 */
const getApartmentDetails = async apartmentId => {
    const apartmentDetails = await isExistById(apartmentId);

    if (!apartmentDetails) {
        throw { message: "Apartment not found" };
    }

    const { id, name, status, createdAt, updatedAt } = apartmentDetails;

    const data = {
        id,
        name,
        status,
    };

    // formate object property
    data.createdAt = DateTime.shortDateAndTime(createdAt);
    data.updatedAt = DateTime.shortDateAndTime(updatedAt);

    return data;
};

/**
 * Update apartment details by apartmentId
 *
 * @param {*} apartmentId
 * @param {*} data
 */
const updateApartmentById = async (apartmentId, data) => {
    const apartmentDetails = await isExistById(apartmentId);

    if (!apartmentDetails) {
        throw { message: "Apartment not found" };
    }

    // Update data
    const updateData = {
        name: data.name,
        status: data.status,
    };

    const save = await apartment.update(updateData, {
        where: { id: apartmentId },
    });

    return save;
};

/**
 * Search apartment
 *
 * @param {*} params
 */
const searchApartment = async params => {
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
        throw { message: `Unable to sort apartment by ${sortParam}` };
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

    // Get apartment list and count
    const apartmentDetails = await apartment.findAndCountAll(query);

    // Return apartment is null
    if (apartmentDetails.count === 0) {
        return null;
    }

    const apartmentData = [];

    apartmentDetails.rows.forEach(apartmentDetail => {
        const { id, name, status, createdAt, updatedAt } = apartmentDetail;

        const data = {
            id,
            name,
            status,
        };

        // formate object property
        data.createdAt = DateTime.shortDateAndTime(createdAt);
        data.updatedAt = DateTime.shortDateAndTime(updatedAt);

        apartmentData.push(data);
    });

    return {
        totalCount: apartmentDetails.count,
        currentPage: page,
        pageSize,
        data: apartmentData,
        sort,
        sortDir,
    };
};

/**
 * Get apartment details by apartmentId
 *
 * @param {*} apartmentId
 */
const deleteApartment = async apartmentId => {
    const apartmentDetails = await isExistById(apartmentId);

    if (!apartmentDetails) {
        throw { message: "Apartment not found" };
    }

    return await apartment.destroy({ where: { id: apartmentId } });
};

export default {
    isExistById,
    isExistByName,
    createApartment,
    getApartmentDetails,
    updateApartmentById,
    searchApartment,
    deleteApartment,
};
