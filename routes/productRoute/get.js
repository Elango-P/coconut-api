/**
 * Module dependencies
 */

const { BAD_REQUEST, OK } = require("../../helpers/Response");
const { getMediaUrl } = require("../../lib/utils");
const DateTime = require("../../lib/dateTime");
const Product = require("../../helpers/Product");

// Models
const {
  product,
  productTag,
  Tag,
  storeProduct,
  productIndex,
} = require("../../db").models;
const productService = require("../../services/ProductService");

/**
 * Product get route by product id
 */
async function get(req, res, next) {
   await productService.get(req, res, next)
 
}
module.exports = get;
