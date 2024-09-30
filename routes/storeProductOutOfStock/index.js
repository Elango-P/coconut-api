/**
 * Module dependencies
 */
// Express router
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");
const create = require("./create");

module.exports = (server) => {
  server.post("/v1/storeProductOutOfStock", verifyToken, create);
  server.get("/v1/storeProductOutOfStock/search", verifyToken, search);
};
