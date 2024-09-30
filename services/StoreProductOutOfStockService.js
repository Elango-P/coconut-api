const { StoreProductOutOfStock, productIndex, Location } = require("../db").models;

// Util
const { shortDateAndTime } = require("../lib/dateTime");

const { Op } = require("sequelize");

const Date = require("../lib/dateTime");


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

        let productExist = await StoreProductOutOfStock.findOne({
            where: whereCondition
        })

        if (productExist) {
            return res.json(400, { message: "Product already exist", })
        }

        let recentRecord = await StoreProductOutOfStock.findOne({
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

        await StoreProductOutOfStock.create(createData);

        res.json(200, { message: "Out Of Stock Product Added" })

    } catch (err) {
        console.log(err);
    }
};

/**
 * Search Location
 *
 * @param {*} params
 */
const search = async (req, res) => {
    try{

    let { page, pageSize, search, sort, sortDir, pagination, status } = req.query;

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
        status: "status",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
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
        ];
    }

    const query = {
        attributes: { exclude: ["deletedAt"] },
        order: [[sortParam, sortDirParam]],
        where,
        include: [
            {
                required: true,
                model: productIndex,
                as: "productIndex",
            },
            {
                required: false,
                model: Location,
                as: "locationDetail",
            }
        ]
    };

    if (pagination) {
        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }
    }

    // Get Location list and count
    const outofStockProducts = await StoreProductOutOfStock.findAndCountAll(query);

    const outOfStockProductData = [];

    for (let productDetail of outofStockProducts.rows) {
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
            sale_proce: productIndex && productIndex.sale_price,
            mrp: productIndex && productIndex.mrp,
            unit: productIndex && productIndex.unit,
            date: date,
            loccation_name: locationDetail && locationDetail.name
        };

        // formate object property
        data.createdAt = shortDateAndTime(createdAt);
        data.updatedAt = shortDateAndTime(updatedAt);

        outOfStockProductData.push(data);
    };

    res.json(200, {
        totalCount: outofStockProducts.count,
        currentPage: page,
        pageSize,
        data: outOfStockProductData,
        sort,
        sortDir,
    });

}catch(err){
    console.log(err);
}
};

module.exports = {
    create,
    search
};
