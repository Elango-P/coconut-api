// Utils
/**
 * Module dependencies
 */
const { BAD_REQUEST, OK } = require("../../helpers/Response");

const { defaultDateFormat }  =require( "../../lib/dateTime");

// Models
const {  collection } = require("../../db").models;

/**
 * collection search route
 */
async function search (req, res, next){
    let { page, pageSize, search, sort, sortDir, pagination } = req.query;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
        return res.json(BAD_REQUEST, { message: "Invalid page",});
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
        return res.json(BAD_REQUEST, { message: "Invalid page size",});
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
        id: "id",
        collectionName: "collection_name",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "collectionName";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.json(BAD_REQUEST, { message: `Unable to sort collection by ${sortParam}`,});
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        return res.json(BAD_REQUEST, { message: "Invalid sort order",});
    }

    const data = req.query;

    const where = {};

    // Search by name
    const collectionName = data.collectionName;
    if (collectionName) {
        where.collection_name = {
            $like: `%${collectionName}%`,
        };
    }

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where.$or = [
            {
                collection_name: {
                    $like: `%${searchTerm}%`,
                },
            },
        ];
    }

    const query = {
        order: [[sortableFields[sortParam], sortDirParam]],
        where,
    };

    if (pagination) {
        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }
    }
    try {
        // Get collection list and count
        const collectionDetails = await collection.findAndCountAll(query);

        // Return collection is null
        if (collectionDetails.count === 0) {
            return res.json({});
        }

        const data = [];
        collectionDetails.rows.forEach(collection => {
            const {
                id,
                collection_name,
                createdAt,
                updatedAt,
            } = collection.get();

            data.push({
                id,
                collectionName: collection_name,
                createdAt: defaultDateFormat(createdAt),
                updatedAt: defaultDateFormat(updatedAt),
            });
        });

         res.json(OK, {
            totalCount: collectionDetails.count,
            currentPage: page,
            pageSize,
            data,
            search,
        });
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

module.exports = search;
