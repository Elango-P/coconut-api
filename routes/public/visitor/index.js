const create = require("./create");

module.exports = (server) => {
	server.post("/v1/public/visitor/add", create);
};
