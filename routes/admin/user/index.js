const user = require("./user");
const verifyToken = require("../../../middleware/verifyToken");
const isAdmin = require("../../../middleware/isAdmin");

module.exports = (server) => {
	server.get("/admin/v1/user", verifyToken, isAdmin, user);
};
