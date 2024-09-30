
 const verifyToken = require("../../middleware/verifyToken");

 const create = require("./create");
 const search = require("./search");
 const del = require("./del");
 const getDetail = require("./get");
 const update  = require("./update");
 const updateStatus  = require("./updateStatus");
 const replenish  = require("./replenish");
const bulkUpdate = require("./bulkUpdate");
const bulkReplenish = require("./bulkReplenish");
const replenishProduct = require("./replenishProduct");
const bulkInsert = require("./bulkInsert");




 module.exports = (server) => {
     server.post("/v1/transfer", verifyToken, create);
     server.get("/v1/transfer/search", verifyToken, search);
     server.del("/v1/transfer/delete/:transferId", verifyToken, del);
     server.get("/v1/transfer/:transferId", verifyToken, getDetail);
     server.put("/v1/transfer/:id", verifyToken, update);
     server.put("/v1/transfer/status", verifyToken, updateStatus);
     server.post("/v1/transfer/replenish", verifyToken, replenish );
     server.put("/v1/transfer/bulkUpdate/:id", verifyToken, bulkUpdate);
     server.post("/v1/transfer/bulkReplenish", verifyToken, bulkReplenish );
     server.get("/v1/transfer/replenishProduct", verifyToken, replenishProduct );
     server.post("/v1/transfer/bulkInsert", verifyToken, bulkInsert);


 }
 