
const wishlistService = require("../../services/WishlistService");


/**
 * Product create route
 */
async function create(req, res, next) {
  wishlistService.create(req, res);
}

module.exports = create;
