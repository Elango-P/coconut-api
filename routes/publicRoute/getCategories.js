// Status
const { BAD_REQUEST } = require("../../helpers/Response");

const { productIndex, productCategory } = require("../../db").models;

const Product = require("../../helpers/Product");

const Setting = require("../../helpers/Setting");

const { loadSettingByName } = require("../../services/SettingService");

const ArrayList = require("../../lib/ArrayList");
const Category = require("../../helpers/Category");

async function search(req, res, next) {
    try {

        let companyId;

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

        let productCategoryList = await productCategory.findAndCountAll({ where: { company_id: companyId, status: Category.STATUS_ACTIVE, allow_online: Category.ALLOW_ONLINE }, order: [["name", "ASC"]] })

        productCategoryList = productCategoryList.rows;

        let productData = await productIndex.findAll(
            {
                where: { company_id: companyId, status: Product.STATUS_ACTIVE },
                attributes: ["id", "product_id", "company_id", "category_id", "featured_media_url", "product_display_name",]
            }
        );

        let categoryList = [];

        let productList;

        if (productCategoryList && productCategoryList.length > 0) {

            for (let i = 0; i < productCategoryList.length; i++) {

                productList = productData.filter((data) => data.category_id == productCategoryList[i].id)

                categoryList.push({
                    id: productCategoryList[i].id,
                    name: productCategoryList[i].name,
                    image: ArrayList.isNotEmpty(productList) && productList[0].featured_media_url
                })
            }

        }

        res.json({ data: categoryList });

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
    }
}
module.exports = search;
