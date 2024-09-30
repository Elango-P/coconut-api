const verifyToken = require("../../middleware/verifyToken");


const listRoute = require("./list");
const createRoute = require("./create");
const getRoute = require("./get");
const deleteRoute = require("./delete");
const updateRoute = require("./update");
const loginByAdmin = require("./loginByAdmin");
const search = require("./search");

module.exports = (server) => {

    server.post("/v1/portal", verifyToken, createRoute);
    server.get("/v1/portal/:id", verifyToken, getRoute);
    server.del("/v1/portal/:id", verifyToken, deleteRoute);
    server.put("/v1/portal/:id", verifyToken, updateRoute);
    server.post("/v1/portal/loginByAdmin/:id", verifyToken, loginByAdmin);
    server.get("/v1/portal/searchByCompany/:id", verifyToken, search);
}