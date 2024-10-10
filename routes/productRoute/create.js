const Permission = require("../../helpers/Permission");
const productService = require("../../services/ProductService");

/**
 * Product create route
 */
async function create(req, res, next) {
   
    await productService.create(req,res,next)

};

module.exports = create;
