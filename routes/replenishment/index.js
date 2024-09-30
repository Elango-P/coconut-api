/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");

const updateOwner = require("./updateOwner");
const pendingList = require("./pendingList");
const list = require("./list");

module.exports = (server) => {
// Product API routes
server.get("/v1/replenishment/search", verifyToken, search);
server.put("/v1/replenishment/updateOwner", verifyToken, updateOwner);
server.get("/v1/replenishment", verifyToken, pendingList);
server.get("/v1/replenishment/list", verifyToken, list);

}
