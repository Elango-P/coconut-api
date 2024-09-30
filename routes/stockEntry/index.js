/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const search = require("./search");
const del = require("./delete");
const getdetail = require("./get");
const update = require("./update");
const updateStatus = require("./updateStatus");

module.exports = (server) => {
    server.get("/v1/stockEntry/:id", verifyToken, getdetail);
    server.post("/v1/stockEntry", verifyToken, create);
    server.get("/v1/stockEntry/search", verifyToken, search); 
    server.del("/v1/stockEntry/:id", verifyToken, del); 
    server.put("/v1/stockEntry/:id", verifyToken, update); 
    server.put("/v1/stockEntry/status/:id", verifyToken, updateStatus); 
}
