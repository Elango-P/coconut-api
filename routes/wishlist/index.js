/**
 * Module dependencies
 */
// Express router
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");
const create = require("./create");
const del =require("./delete")
module.exports = (server) => {
  server.post("/v1/wishlist", verifyToken, create);
  server.del("/v1/wishlist/:id", verifyToken, del);
  server.get("/v1/wishlist/search", verifyToken, search);
};
