const productService = require("../../services/ProductService");
async function Clone(req, res, next) {
    try{
        productService.clone(req, res, next)
    } catch(err){
        console.log(err);
    }
}
module.exports = Clone;