const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search");
const del = require("./delete");
const update = require("./update");
const getDetail = require("./getDetail");
const updateStatus = require("./updateStatus");
const updateGstStatus = require("./updateGstStatus");
const getPendingBill = require("./getPendingBill");

module.exports = (server) => {
	server.post("/v1/accounts/bill", verifyToken, create);
	server.get("/v1/accounts/bill/search", verifyToken, search);
	server.del("/v1/accounts/bill/delete/:id", verifyToken, del);
	server.put("/v1/accounts/bill/:id", verifyToken, update);
	server.get("/v1/accounts/bill/detail/:billId", verifyToken, getDetail);
	server.put("/v1/accounts/bill/status/:id", verifyToken, updateStatus);
	server.put("/v1/accounts/bill/gstStatusUpdate/:id", verifyToken, updateGstStatus);
	server.get("/v1/accounts/bill/pending", verifyToken, getPendingBill);


};
