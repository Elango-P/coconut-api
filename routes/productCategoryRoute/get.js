/**
 * Module dependencies
 */
const Category = require("../../helpers/Category");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const Request = require("../../lib/request");

// Models
const { productCategory } = require("../../db").models;
/**
 * Product category get route by product id
 */
 async function get (req, res, next){
    try{
    const { id } = req.params;
    let company_id = Request.GetCompanyId(req);
    // Validate product category id
    if (!id) {
        return res.json(BAD_REQUEST, { message: "Product category id is required"});
    }

    // Validate product category is exist or not
    const productCategoryDetails = await productCategory.findOne({
        where: { id ,company_id},
    });

    if (!productCategoryDetails) {
        return res.json(BAD_REQUEST, { message:"Product category not found"});
    }

    // API response
    res.json(OK, {
        data: {
            id,
            name: productCategoryDetails.name,
            status: productCategoryDetails.status,
            allowOnline: productCategoryDetails.allow_online == Category.ALLOW_ONLINE ? true: false
        },
    });
} catch (err){
    console.log(err);
}
};

module.exports = get;
