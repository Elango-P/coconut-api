// Status
const { BAD_REQUEST } = require("../../helpers/Response");

const { productIndex, productCategory, ProductPrice: ProductPriceModal } = require("../../db").models;

const Product = require("../../helpers/Product");

const Setting = require("../../helpers/Setting");

const { loadSettingByName } = require("../../services/SettingService");

const ArrayList = require("../../lib/ArrayList");

const ProductPrice = require("../../helpers/ProductPrice");
const { Op } = require("sequelize");

async function search(req, res, next) {
    try {
        let {
            page,
            pageSize,
            search,
            sort,
            sortDir,
            categoryId
        } = req.query;

        let companyId;

        page = page ? parseInt(page, 10) : 1;

        const searchTerm = search ? search.trim() : null;

        if (isNaN(page)) {
            return res.json(BAD_REQUEST, { message: "Product id is required" });
        }

        // Validate if page size is not a number
        pageSize = pageSize ? parseInt(pageSize, 10) : 25;

        if (isNaN(pageSize)) {
            return res.json(BAD_REQUEST, { message: "Invalid page size" });
        }

        let settingList = await loadSettingByName(Setting.ONLINE_SALE_COMPANY);

        if (ArrayList.isNotEmpty(settingList)) {

            let settindData = settingList.find((data) => data.value);

            companyId = settindData ? settindData.get().company_id : null;

            if (!companyId) {
                return res.json(BAD_REQUEST, { message: "Something went wrong" });
            }

        } else {
            return res.json(BAD_REQUEST, { message: "Something went wrong" });
        }

        let query = {
            where: { company_id: companyId, status: Product.STATUS_ACTIVE, category_id: categoryId },
        };

        if (searchTerm ) {
            query.where[Op.or] = [
              {
                product_display_name: {
                  [Op.iLike]: `%${searchTerm.replace(/\s+/g, "%")}%`,
                },
              },
              {
                product_name: {
                  [Op.iLike]: `%${searchTerm.replace(/\s+/g, "%")}%`,
                },
              },
            ];
          
        }

        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }

        query.attributes = ["id", "product_id", "company_id", "category_id", "featured_media_url", "product_display_name", "sale_price", "mrp"]

        let productData = await productIndex.findAndCountAll(query);

        let products = productData.rows;

        let productPriceDetail;

        let productList = [];

        if (products && products.length > 0) {

            for (let i = 0; i < products.length; i++) {

                productPriceDetail = await ProductPriceModal.findOne({
                    where: { product_id: products[i].product_id, is_default: ProductPrice.IS_DEFAULT }
                })

                productList.push({
                     id: products[i].product_id,
                     company_id: products[i].company_id,
                     category_id: products[i].category_id,
                     featured_media_url: products[i].featured_media_url,
                     product_display_name: products[i].product_display_name,
                     sale_price: productPriceDetail ? productPriceDetail.sale_price: null,
                     mrp: productPriceDetail ? productPriceDetail.mrp: null,
                     productPriceId: productPriceDetail? productPriceDetail.id: null
                })

            }
        }

        res.json({
            totalCount: productData.count,
            currentPage: page,
            pageSize,
            data: productList ? productList : [],
            sort,
            sortDir,
            search,
        });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
    }
}
module.exports = search;
