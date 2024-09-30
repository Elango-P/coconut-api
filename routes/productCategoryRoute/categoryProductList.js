// Service dependencies
const productCategoryService = require('../../services/ProductCategoryService');
async function search(req, res, next) {
  //  search route
  try {
    productCategoryService.search(req, res);
  } catch (err) {
    // Error Handling
    console.log(err);
  }
}
// Export search route function
module.exports = search;