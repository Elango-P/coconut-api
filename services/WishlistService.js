const { Wishlist, productIndex, Location } = require("../db").models;

// Util
const { shortDateAndTime } = require("../lib/dateTime");

const { Op } = require("sequelize");

const Date = require("../lib/dateTime");
const Boolean = require("../lib/Boolean");
const validator = require("../lib/validator")


/**
 *  Create Product
 *
 * @param {*} data
 */
const create = async (req, res) => {
    try {

    const data = req.body;

    const companyId = Request.GetCompanyId(req);

    let whereCondition = new Object();

    if (data.productId) {
        whereCondition.product_id = data.productId
    }

    if (data.storeId) {
        whereCondition.store_id = data.storeId
    }

    whereCondition.company_id = companyId;

    whereCondition.date = data.date;

    let productExist = await Wishlist.findOne({
        where: whereCondition
    })

    if (productExist) {
        return res.json(400, { message: "Product already exist", })
    }

    let recentRecord = await Wishlist.findOne({
        where: { company_id: companyId },
        order: [["createdAt", "DESC"]],
        paranoid: false
    })

    let orderNumber = recentRecord && recentRecord.record_number ? recentRecord.record_number + 1 : 1;

    const createData = {
        date: data.date,
        store_id: data.storeId,
        product_id: data.productId,
        status: 1,
        record_number: orderNumber,
        company_id: companyId
    }

    await Wishlist.create(createData);

    res.json(200, { message: "Wishlist Added" });
} catch (err){
    console.log(err);
}

};

/**
 * Search Location
 *
 * @param {*} params
 */
const search = async (req, res) => {

    try {

    let { page, pageSize, search, sort, sortDir, pagination, status, location, startDate, endDate } = req.query;

    const companyId = Request.GetCompanyId(req);

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
        date: "date",
        status: "status",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        product_display_name: "product_display_name"
    };

    const sortParam = sort || "createdAt";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort Location by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        throw { message: "Invalid sort order" };
    }

    let where = new Object();

    where.company_id = companyId;

    if (status) {
        where.status = status;
    }


    if (location) {
        where.store_id = location;
    }

    if (startDate && !endDate) {
        where.date = {
            [Op.and]: {
                [Op.gte]: startDate,
            },
        };
    }
    if (endDate && !startDate) {
        where.date = {
            [Op.and]: {
                [Op.lte]: endDate,
            },
        };
    }

    if (startDate && endDate) {
        where.date = {
            [Op.and]: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
            },
        };
    }



    // Search term
    const searchTerm = search ? search.trim() : null;

    if (searchTerm) {
        where[Op.or] = [
            {
                "$productIndex.category_name$": {
                    [Op.iLike]: `%${searchTerm}%`,
                },
            },
            {
                "$productIndex.brand_name$": {
                    [Op.iLike]: `%${searchTerm}%`,
                },
            },
            {
                "$productIndex.product_name$": {
                    [Op.iLike]: `%${searchTerm}%`,
                },
            },
            {
                "$locationDetail.name$": {
                    [Op.iLike]: `%${searchTerm}%`,
                },
            },
        ];
    }

    const query = {
        attributes: { exclude: ["deletedAt"] },
        order: sort !== "name" ? sort !== "product_display_name" ? [[sortParam, sortDirParam]] : [[{ model: productIndex, as: 'productIndex' }, 'product_display_name', sortDir]] : [[{ model: Location, as: 'locationDetail' }, 'name', sortDir]],
        where,
        include: [
            {
                required: true,
                model: productIndex,
                as: "productIndex",
                attributes: ["product_display_name", "featured_media_url", "brand_name", "sale_price", "mrp", "unit", "brand_id"]
            },
            {
                required: false,
                model: Location,
                as: "locationDetail",
                attributes: ["name"]

            }
        ]
    };

    if (validator.isEmpty(pagination)) {
        pagination = true;
    }
    if (Boolean.isTrue(pagination)) {
        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }
    }

    // Get Location list and count
    const wishlistProducts = await Wishlist.findAndCountAll(query);

    const wishlistProductData = [];

    for (let productDetail of wishlistProducts.rows) {
        const {
            id,
            name,
            status,
            product_id,
            store_id,
            record_number,
            createdAt,
            updatedAt,
            productIndex,
            date,
            locationDetail
        } = productDetail;

        const data = {
            id,
            name,
            status,
            product_id,
            store_id,
            record_number,
            createdAt,
            updatedAt,
            image: productIndex && productIndex.featured_media_url,
            product_name: productIndex && productIndex.product_display_name,
            brand_name: productIndex && productIndex.brand_name,
            category_name: productIndex && productIndex.category_name,
            sale_price: productIndex && productIndex.sale_price,
            mrp: productIndex && productIndex.mrp,
            unit: productIndex && productIndex.unit,
            date: date,
            location_name: locationDetail && locationDetail.name,
            brand_id: productIndex && productIndex.brand_id
        };

        // formate object property
        data.createdAt = shortDateAndTime(createdAt);
        data.updatedAt = shortDateAndTime(updatedAt);

        wishlistProductData.push(data);
    };

    res.json(200, {
        totalCount: wishlistProducts.count,
        currentPage: page,
        pageSize,
        data: wishlistProductData,
        sort,
        sortDir,
        pagination
    });
    } catch (err){
        console.log(err);
    }

};

module.exports = {
    create,
    search
};
