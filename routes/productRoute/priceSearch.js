const { Op } = require("sequelize");
const { BAD_REQUEST } = require("../../helpers/Response");
const Request = require("../../lib/request");
const Boolean = require("../../lib/Boolean");
const validator = require("../../lib/validator");
const DataBaseService = require("../../lib/dataBaseService");
const { productIndex, PurchaseProduct, Purchase, ProductPrice: productPriceModel, status: statusModel } = require("../../db").models;
const productPriceService = new DataBaseService(productPriceModel)

async function priceSearch(req, res, next) {
    let {
        page,
        pageSize,
        search,
        sort,
        sortDir,
        pagination,
        brand,
        category,
        tag,
        status
    } = req.query;
    try {

        page = page ? parseInt(page, 10) : 1;
        if (isNaN(page)) {
            return res.json(BAD_REQUEST, { message: "Product id is required" });
        }

        let productDetailWhere = {};
        let where = {}
        // Validate if page size is not a number
        pageSize = pageSize ? parseInt(pageSize, 10) : 25;
        if (isNaN(pageSize)) {
            return res.json(BAD_REQUEST, { message: "Invalid page size" });
        }

        let companyId = Request.GetCompanyId(req);

        const validOrder = ["ASC", "DESC"];
        const sortableFields = {
            id: "id",
            mrp: "mrp",
            cost: "cost",
            product_name: "product_name",
            createdAt: "createdAt"
        };

        const sortParam = sort || "product_name";
        // Validate sortable fields is present in sort param
        if (!Object.keys(sortableFields).includes(sortParam)) {
            return res.json(BAD_REQUEST, {
                message: `Unable to sort product by ${sortParam}`,
            });
        }

        const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
        // Validate order is present in sortDir param
        if (!validOrder.includes(sortDirParam)) {
            return res.json(BAD_REQUEST, { message: "Invalid sort order" });
        }

        const searchTerm = search ? search.trim() : null;
        if (searchTerm) {
            productDetailWhere[Op.or] = [
                {
                    product_display_name: {
                        [Op.iLike]: `%${searchTerm.replace(/\s+/g, '%')}%`,
                    },
                },
            ];
        }




        productDetailWhere.company_id = companyId;
        let order = []
        if (sort === "product_name") {
            order.push(
                [{ model: productIndex, as: 'productDetails' }, 'brand_name', sortDir],
                [{ model: productIndex, as: 'productDetails' }, 'product_name', sortDir],
                [{ model: productIndex, as: 'productDetails' }, 'size', sortDir],
                [{ model: productIndex, as: 'productDetails' }, 'sale_price', sortDir],
            )
        }

        if (sort === "mrp") {
            order.push(
                [{ model: productIndex, as: 'productDetails' }, 'mrp', sortDir]
            )
        }

        if (sort === "cost") {
            order.push(
                [{ model: productIndex, as: 'productDetails' }, 'cost', sortDir]
            )
        }

        if (sort === "createdAt") {
            order.push(
                [sortParam, sortDirParam],
            )
        }
        where.company_id = companyId

        if (status) {
            where.status = status
        }
        if (brand) {
            productDetailWhere.brand_id = brand
        }
        if (category) {
            productDetailWhere.category_id = category
        }
        if (tag) {
            productDetailWhere.manufacture_id = tag
        }
        let query = {
            order,
            where,
            include: [{
                required: true,
                model: productIndex,
                as: "productDetails",
                where: productDetailWhere,
            },
            {
                required: false,
                model: statusModel,
                as: "statusDetail"
            }
            ]
        }

        if (validator.isEmpty(pagination)) {
            pagination = true;
        }
        if (Boolean.isTrue(pagination)) {
            if (pageSize > 0) {
                query.limit = pageSize;
                query.offset = (page - 1) * pageSize;
            }
        }


        let productPriceList = await productPriceService.findAndCount(query);
        let productPriceData = productPriceList && productPriceList?.rows;

        let data = [];
        let filteredData = [];
        for (let i = 0; i < productPriceData.length; i++) {
            let { product_id, productDetails, statusDetail } = productPriceData[i];

            let getPurchaseProductList = await PurchaseProduct.findOne({
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        required: true,
                        model: Purchase,
                        as: "purchaseDetail",
                    },
                ],
                where: {
                    product_id: product_id,
                    company_id: companyId
                }
            });
            const purchase_cost = getPurchaseProductList !== null ? getPurchaseProductList.unit_price : "";
            const purchase_mrp = getPurchaseProductList !== null ? getPurchaseProductList.mrp : "";
            let list = {
                product_id,
                product_name: productDetails?.product_name,
                brand_name: productDetails?.brand_name,
                image: productDetails?.featured_media_url,
                size: productDetails?.size,
                unit: productDetails?.unit,
                sale_price: productDetails?.sale_price,
                mrp: productDetails?.mrp,
                cost: productDetails?.cost,
                purchase_cost,
                purchase_mrp,
                last_purchase_date: getPurchaseProductList?.purchaseDetail?.purchase_date || "",
                brand_id: productDetails?.brand_id,
                color_code: statusDetail?.color_code,
                statusText: statusDetail?.name || "",
            };

            if ((purchase_mrp !== productDetails?.mrp) || (purchase_cost !== productDetails?.cost)) {
                if (data.length < pageSize) {
                    data.push(list);
                }
            } else if (filteredData.length < pageSize) {
                filteredData.push(list);
            }
            if (data.length >= pageSize) break;
        }

        for (let item of filteredData) {
            if (data.length < pageSize) {
                data.push(item);
            }
        }
        res.json({
            totalCount: productPriceList.count,
            currentPage: page,
            pageSize,
            data: data,
            sort,
            sortDir,
            search,
        });
    } catch (err) {
        console.log(err);
    }

}
module.exports = priceSearch;