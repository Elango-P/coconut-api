// Verify Token
const verifyToken = require("../../middleware/verifyToken");

// List
const list = require("./list");
const getFeatures = require("./getFeatures");

module.exports = (server) => {
	server.get("/permission/v1/list", verifyToken, list);
	server.get("/permission/v1/featureName", verifyToken, getFeatures);
};
