// Utils
/**
 * Module dependencies
 */
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const DateTime = require("../../lib/dateTime");

// Models
const { TagType } = require("../../db").models;

// Sequelize
const { Op } = require("sequelize");

// Lib
const Request = require("../../lib/request");

/**
 * tag search route
 */
 async function search(req, res, next){
  
    let { page, pageSize, search, sort, sortDir, pagination } = req.query;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
        return res.json(BAD_REQUEST, { message :  "Invalid page"  ,})
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
        return res.json(BAD_REQUEST, { message :  "Invalid page size" ,})
    }

    const companyId = Request.GetCompanyId(req);

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
        id: "id",
        name: "name",
        type: "type",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "name";

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.json(BAD_REQUEST, { message :  `Unable to sort product by ${sortParam}`,})
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        return res.json(BAD_REQUEST, { message: "Invalid sort order",})
    }

    const data = req.query;

    const where = {};

    where.company_id = companyId;

    if(data.tagName ){
        where.name={[Op.like]: data.tagName  }
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
        where[Op.or] = [
            {
                name: {
                    [Op.iLike]: `%${searchTerm}%`,
                },
            },
        ];
    }

    const query = {
        attributes: ["id", "name", "type", "createdAt", "updatedAt"],
        order: [[sortParam, sortDirParam]],
        where,
    };

    if (pagination) {
        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }
    }

    try {
        // Get tag list and count
        const tagList = await TagType.findAndCountAll(query);

        // Return tag is null
        if (tagList.count === 0) {
            return res.json({});
        }

        const data = [];
        tagList.rows.forEach(tags => {
            const {
                id,
                name,
                type,
                createdAt,
                updatedAt,
            } = tags.get();

            data.push({
                id,
                name,
                type,
                createdAt: DateTime.defaultDateFormat(createdAt),
                updatedAt: DateTime.defaultDateFormat(updatedAt),
            });
        });
        
        res.json(OK, {
            totalCount: tagList.count,
            currentPage: page,
            pageSize,
            data,
            search,
            sort,
            sortDir,
        })
    } catch (err) {
        res.json(BAD_REQUEST, { message : err.message });
    }
};

module.exports = search;
