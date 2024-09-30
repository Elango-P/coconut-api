const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const search = require("./search");
const update = require("./update");

module.exports = (server) => {
    server.post("/v1/ticketTest/create", verifyToken, create);
    server.get("/v1/ticketTest/search", verifyToken, search);
    server.put("/v1/ticketTest/update/:id", verifyToken, update);
    server.post("/v1/ticketTest/delete", verifyToken, del);

};