const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");
const create = require("./create");
const update = require("./update");
const del = require("./delete");
const list = require("./list");
const bulkInsert = require("./bulkInsert")
const bulkUpdate = require("./bulkUpdate")
const cancel = require("./cancel");
const get = require("./get");
const replenishSearch = require("./replenishSearch");
const bulkCancel = require("./bulkCancel");
const bulkUpdateFromProduct = require("./bulkUpdateFromProduct");
const getTotalAmount = require("./getTotalAmount");

module.exports = (server) => {
  server.post("/v1/orderProduct/create", verifyToken, create);
  server.get("/v1/orderProduct/search", verifyToken, search);
  server.put("/v1/orderProduct/update/:id", verifyToken, update);
  server.post("/v1/orderProduct/delete/:id", verifyToken, del);
  server.get("/v1/orderProduct/list", verifyToken, list);
  server.post("/v1/orderProduct/bulkInsert", verifyToken, bulkInsert);
  server.put("/v1/orderProduct/bulkUpdate", verifyToken, bulkUpdate);
  server.post("/v1/orderProduct/cancel/:id", verifyToken, cancel);
  server.get("/v1/orderProduct/get", verifyToken, get);
  server.get("/v1/orderProduct/replenish/search", verifyToken, replenishSearch);
  server.post("/v1/orderProduct/bulkCancel", verifyToken, bulkCancel);
  server.put("/v1/orderProduct/bulkUpdate/fromProduct", verifyToken, bulkUpdateFromProduct);
  server.get("/v1/orderProduct/totalAmount", verifyToken, getTotalAmount);
};
