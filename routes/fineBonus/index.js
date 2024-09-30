const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const search = require("./search");
const update = require("./update");
const updateStatus = require("./updateStatus");
const bulkupdate = require("./bulkupdate");
const bulkDelete = require("./bulkDelete");

module.exports = (server) => {
  server.post("/v1/fineBonus", verifyToken, create);
  server.get("/v1/fineBonus/search", verifyToken, search);
  server.put("/v1/fineBonus/:id", verifyToken, update);
  server.get("/v1/fineBonus/:id", verifyToken, get);
  server.del("/v1/fineBonus/:id", verifyToken, del);
  server.put("/v1/fineBonus/status/:id", verifyToken, updateStatus);
  server.put("/v1/fineBonus/bulkUpdate", verifyToken, bulkupdate);
	server.del("/v1/fineBonus/bulkDelete", verifyToken, bulkDelete);
};
