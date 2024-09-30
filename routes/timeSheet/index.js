/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const search = require("./search");
const statusUpdate = require("./statusUpdate");
const update = require("./update");

module.exports = (server) => {
    server.get("/v1/timeSheet/search", verifyToken, search);
    server.post("/v1/timeSheet/create", verifyToken, create);
    server.put("/v1/timeSheet/status/:id", verifyToken, statusUpdate);
    server.del("/v1/timeSheet/delete/:timesheet_number", verifyToken, del);
    server.put("/v1/timeSheet/:id", verifyToken, update);
};
