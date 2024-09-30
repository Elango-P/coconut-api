const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search")
const updateStatus = require("./statusUpdate");
const resetToDefault = require("./resetToDefault");
const leaveList = require("./leaveList");

module.exports = (server) => {
                          
	server.put("/v1/locationAllocationUser", verifyToken, create);
	server.get("/v1/locationAllocationUser/search", verifyToken, search);
	server.put("/v1/locationAllocationUser/statusUpdate", verifyToken, updateStatus);
	server.put("/v1/locationAllocationUser/resetToDefault/:id", verifyToken, resetToDefault);
	server.get("/v1/locationAllocationUser/leaveList", verifyToken, leaveList);


};
