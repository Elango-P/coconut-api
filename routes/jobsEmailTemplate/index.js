const list = require("./list");
const get = require("./get");
const create = require("./create");
const update = require("./update");
const del = require("./del");

module.exports = (server) => {
    server.get("/template/v1/list", list);
    server.get("/template/v1/list/:id", get);
    server.post("/template/v1/create", create);
    server.put("/template/v1/:id", update);
    server.del("/template/v1/:id", del);
}

