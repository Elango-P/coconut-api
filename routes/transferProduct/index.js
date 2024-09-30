

const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const search = require("./search");
const update = require("./update");
const del = require("./del");
const statusUpdate = require("./statusUpdate");
const bulkInsert = require("./bulkInsert");
const bulkUpdate = require("./bulkUpdate");
const clone = require("./clone");
const report = require("./report");
const reportUserWise = require("./reportUserWise");

module.exports = (server) => {
    server.post("/v1/transfer/Product", verifyToken, create);
    server.get("/v1/transfer/Product/search", verifyToken, search);
    server.put("/v1/transfer/Product/:id", verifyToken, update);
    server.del("/v1/transfer/Product/:transferId", verifyToken, del);
    server.put("/v1/transfer/Product/status/:id", verifyToken, statusUpdate);
    server.post("/v1/transfer/Product/bulkInsert", verifyToken, bulkInsert);
    server.post("/v1/transfer/Product/bulkUpdate", verifyToken, bulkUpdate);
    server.put("/v1/transfer/Product/clone/:id", verifyToken, clone);
    server.get("/v1/transfer/Product/report", verifyToken, report);
    server.get("/v1/transfer/Product/userWiseReport", verifyToken, reportUserWise);
}
