const verifyToken = require("../../middleware/verifyToken");
const get = require("./get");
const download = require("./download");
const create = require("./create");
const del = require("./del");

module.exports = (server) => {
	server.get("/poa/v1/download/:ticketId", download);
	server.get("/poa/v1/:ticketId/:projectSlug", verifyToken, get);
	server.post("/poa/v1/create/:ticketId/:projectSlug", verifyToken, create);
	server.del("/poa/v1/:poaId", verifyToken, del);
};
