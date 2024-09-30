const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search");
const get = require("./get");

module.exports = (server) => {
    server.post("/v1/customFieldValue", verifyToken, create);
    server.get("/v1/customFieldValue/search", verifyToken, search);
    server.get("/v1/customFieldValue/:id", verifyToken, get);
};