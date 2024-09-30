/**
 * Module dependencies
 */
const { BAD_REQUEST, OK } = require("../../helpers/Response");

const { getBrandImageUrl } = require("../../lib/Url");
const Request = require("../../lib/request");

const { productBrand } = require("../../db").models;

/**
 * Brand get route by brand id
 */
 async function get(req, res, next){
    try {
    const { id } = req.params;
    let company_id = Request.GetCompanyId(req);

    // Validate brand id
    if (!id) {
        return res.json(BAD_REQUEST, {  message: "Brand id is required"});
    }

    const productBrandDetails = await productBrand.findOne({
        where: { id , company_id},
    });

    // Validate brand is exist or not
    if (!productBrandDetails) {
        return res.json(BAD_REQUEST, {  message: "Brand not found"});
    }

    res.json(OK, {
        data: {
            id,
            name: productBrandDetails.name,
            image: productBrandDetails.image
                ? getBrandImageUrl(id, productBrandDetails.image)
                : "",
            status: productBrandDetails.status,
            manufacture_id : productBrandDetails.manufacture_id,
        },
    });
} catch (err){
    console.log(err);
}
};
module.exports = get;
