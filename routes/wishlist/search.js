
const wishlistService = require("../../services/WishlistService");


const search = async (req, res) => {
  wishlistService.search(req, res);
};

module.exports = search;