const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search");
const getdetail = require("./get");
const update = require("./update");
const del = require("./delete");
const updateStatus = require("./updateStatus");
const clone = require("./clone");
const etaRequest = require("./etaRequest");
const getPendingTicket = require("./getPendingTicket");
const summery = require("./summery");
const createSubTask = require("./subTask");
const bulkDelete = require("./bulkDelete");
const bulkUpdate = require("./bulkUpdate");

module.exports = (server) => {
  server.post("/v1/ticket", verifyToken, create);
  server.get("/v1/ticket/:id", verifyToken, getdetail);
  server.get("/v1/ticket/search", verifyToken, search);
  server.put("/v1/ticket/:id", verifyToken, update);
  server.del("/v1/ticket/:id", verifyToken, del);
	server.put("/v1/ticket/status/:id", verifyToken, updateStatus);
  server.put("/v1/ticket/clone/:id", verifyToken, clone);
  server.post("/v1/ticket/change/eta/request", verifyToken, etaRequest);
  server.get("/v1/ticket/pending", verifyToken, getPendingTicket);
  server.get("/v1/ticket/summery", verifyToken, summery);
  server.get("/v1/ticket/create/subTask", verifyToken, createSubTask);
  server.del("/v1/ticket/bulkDelete", verifyToken, bulkDelete);
  server.put("/v1/ticket/bulkUpdate", verifyToken, bulkUpdate);

};