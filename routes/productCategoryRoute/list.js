
const Category = require("../../helpers/Category");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const { productCategory } = require("../../db").models;
const Request = require("../../lib/request");


async function list(req, res, next) {

    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
        return res.json(400, { message: "Company Not Found" })
    }

    const where = {};

    where.company_id = companyId;
    where.status =  Category.STATUS_ACTIVE;
   
    const query = {
        order: [["name", "ASC"]],
        where,
    };

    try {
        // Get Product category list and count
        const productCategories = await productCategory.findAndCountAll(query);

        // Return products category is null
        if (productCategories.count === 0) {
            return res.json({});
        }

        const data = [];
        productCategories.rows.forEach(productCategory => {
            const {
                id,
                name,
            } = productCategory.get();

            data.push({
                id,
                name,
            });
        });

        res.json(OK, {
            data,
        });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
    }
};

module.exports = list;
