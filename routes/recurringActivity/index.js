const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const search = require("./search");
const update = require("./update");
const updateStatus = require("./updateStatus");


module.exports = (server) => {
  server.post("/v1/recurringActivity", verifyToken, create);
  server.get("/v1/recurringActivity/:id", verifyToken, get);
  server.get("/v1/recurringActivity/search", verifyToken, search);
  server.put("/v1/recurringActivity/:id", verifyToken, update);
  server.del("/v1/recurringActivity/:id", verifyToken, del);
  server.put("/v1/recurringActivity/status/:id", verifyToken, updateStatus);
};