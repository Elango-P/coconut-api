/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const search = require("./search");
const update = require("./update");



module.exports = (server) => {
server.get("/v1/ticketTestCase/search", verifyToken, search);
server.get("/v1/ticketTestCase/:id", verifyToken, get);
server.post("/v1/ticketTestCase/create", verifyToken, create);
server.put("/v1/ticketTestCase/update/:id", verifyToken, update);
server.del("/v1/ticketTestCase/delete/:id", verifyToken, del);
};
