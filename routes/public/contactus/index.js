const verifyAuthorization = require("../../../middleware/verifyAuthorization");
const create = require("./create");

module.exports = (server) => {
	server.post("/public/contactus/v1", verifyAuthorization, create);
};
