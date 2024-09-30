const verifyToken = require("../../middleware/verifyToken");
const clone = require("./clone");
const list = require("./list");



module.exports = (server) => {
	server.get("/v1/role/list", verifyToken, list);
    server.put("/v1/role/clone/:id", verifyToken, clone);

};
