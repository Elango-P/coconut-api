const ProductCategoryService = require("../../services/ProductCategoryService");


const productAdd = async (req, res,next) => {

  ProductCategoryService.createProduct(req,res,next);
};
module.exports = productAdd;