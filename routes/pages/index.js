// Module dependencies
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const create = require("./create");
const search = require("./search");
const get = require("./get");
const update = require("./update");
const del = require("./delete");
const statusUpdate = require("./statusUpdate");

// Pages API routes
module.exports = (server) => {
    server.post("/v1/page", verifyToken, create);
    server.get("/v1/page/search", verifyToken, search);
    server.get("/v1/page/:id", verifyToken, get);
    server.put("/v1/page/:id", verifyToken, update);
    server.del("/v1/page/:id", verifyToken, del);
    server.put("/v1/page/status/:id", verifyToken, statusUpdate);
}