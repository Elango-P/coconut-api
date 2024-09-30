const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search");
const update = require("./update");
const del = require("./delete");
const addFromPurchase = require("./addFromPurchase");
const bulkUpdate = require("./bulkUpdate");

module.exports = (server) =>{
server.get("/v1/accountProduct/search", verifyToken, search);
server.post("/v1/accountProduct/addFromPurchase", verifyToken, addFromPurchase);
server.post("/v1/accountProduct/create", verifyToken, create);
server.put("/v1/accountProduct/:id", verifyToken, update);
server.del("/v1/accountProduct/:id", verifyToken, del);
server.put("/v1/accountProduct/bulkUpdate", verifyToken, bulkUpdate);
}