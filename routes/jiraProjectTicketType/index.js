const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const create = require("./create");
const update = require("./update");
const del = require("./del");

module.exports = (server) => {
    server.get("/jira/v1/project/ticket/type", verifyToken, list);
    server.post("/jira/v1/project/ticket/type", verifyToken, create);
    server.put("/jira/v1/project/ticket/type/:id", verifyToken, update);
    server.del("/jira/v1/project/ticket/type/:id", verifyToken, del);
};