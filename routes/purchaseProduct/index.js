const verifyToken = require("../../middleware/verifyToken");
const vendorSearch = require("./vendorSearch");

module.exports = (server) => {
	 server.get("/v1/purchaseProduct/vendorSearch", verifyToken, vendorSearch);
	


};