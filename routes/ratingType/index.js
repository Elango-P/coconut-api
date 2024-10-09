/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const list = require("./list");
const search = require("./search");
const update = require("./update");
const updateStatus = require("./updateStatus");

module.exports = (server) => {
// Rating Type API routes
server.get("/v1/ratingTypeRoute/search", verifyToken, search);
server.get("/v1/ratingTypeRoute/list", verifyToken, list);
server.get("/v1/ratingTypeRoute/:id", verifyToken, get);
server.post("/v1/ratingTypeRoute", verifyToken, create);
server.put("/v1/ratingTypeRoute/:id", verifyToken, update);
server.del("/v1/ratingTypeRoute/:id", verifyToken, del);
server.put("/v1/ratingTypeRoute/status/:id", verifyToken, updateStatus);
};
