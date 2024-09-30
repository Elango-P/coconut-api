const verifyAuthorization = require("../../../middleware/verifyAuthorization");
const list = require("./list");

module.exports = (server) => {
	server.get("/public/jobs/v1/list", verifyAuthorization, list);
};
