/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const search = require("./search");
const update = require("./update");


module.exports = (server) => {
server.get("/v1/timeSheetDetail/search", verifyToken, search);
// server.get("/v1/productTag/:id", verifyToken, get);
server.post("/v1/timeSheetDetail/create", verifyToken, create);
server.put("/v1/timeSheetDetail/update/:id", verifyToken, update);
server.post("/v1/timeSheetDetail/delete", verifyToken, del);
// server.put("/v1/productTag/status/:id", verifyToken, updateTagStatus);
};
