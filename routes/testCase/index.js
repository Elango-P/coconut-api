/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./del");
const search = require("./search");
const update = require("./update");



module.exports = (server) => {
server.get("/v1/testCase/search", verifyToken, search);
server.post("/v1/testCase/create", verifyToken, create);
server.put("/v1/testCase/update/:id", verifyToken, update);
server.del("/v1/testCase/delete/:id", verifyToken, del);
};
