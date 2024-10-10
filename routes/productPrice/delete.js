const Permission = require("../../helpers/Permission");
const ProductPriceService = require("../../services/ProductPriceService");

/**
 * Product create route
 */
async function del(req, res, next) {
  
    await ProductPriceService.del(req,res,next)

};

module.exports = del;
