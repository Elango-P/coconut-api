const verifyToken = require("../../middleware/verifyToken");

const search = require("./search");
const createRoute = require("./create");
const getRoute = require("./get");
const deleteRoute = require("./delete");
const updateRoute = require("./update");
const loginByAdmin = require("./loginByAdmin");
const updateStatus = require("./updateStatus");
const list = require("./list");

module.exports = (server) => {
    server.get("/v1/company/search", verifyToken, search);
    server.get("/v1/company/list", list);
    server.post("/v1/company", verifyToken, createRoute);
    server.get("/v1/company", verifyToken, getRoute);
    server.put("/v1/company/:id", verifyToken, updateRoute);
    server.del("/v1/company/:id", verifyToken, deleteRoute);
    server.get("/v1/company/loginByAdmin/:id", verifyToken, loginByAdmin);
    server.put("/v1/company/status/:id" , verifyToken, updateStatus );
}