const verifyToken = require("../../middleware/verifyToken");

const createRoute = require("./create");
const searchRoute = require("./search");
const updateRoute = require("./update");
const get = require("./get");
const deleteRoute = require("./delete");
module.exports = (server) => {
    server.post("/v1/projectComponent", verifyToken, createRoute);
    server.get("/v1/projectComponent/search", verifyToken, searchRoute);
    server.put("/v1/projectComponent/:id", verifyToken, updateRoute);
    server.get("/v1/projectComponent/:id", verifyToken, get);
    server.del("/v1/projectComponent/:id", verifyToken, deleteRoute);

};