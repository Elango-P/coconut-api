const verifyToken = require("../../middleware/verifyToken");

const createRoute = require("./create");
const searchRoute = require("./search");
const updateRoute = require("./update");
const get = require("./get");
const deleteRoute = require("./delete");
const listRoute = require("./list")
module.exports = (server) => {
    server.post("/v1/projectTicketType", verifyToken, createRoute);
    server.get("/v1/projectTicketType/search", verifyToken, searchRoute);
    server.put("/v1/projectTicketType/:id", verifyToken, updateRoute);
    server.get("/v1/projectTicketType/:id", verifyToken, get);
    server.del("/v1/projectTicketType/:id", verifyToken, deleteRoute);
    server.get("/v1/projectTicketType/list", verifyToken, listRoute);

};