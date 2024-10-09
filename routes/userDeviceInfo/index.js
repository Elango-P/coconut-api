
const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const search =require("./search");
const statusUpdate = require("./statusUpdate");
const bulkDelete = require("./delete");
const update = require("./update");

module.exports = (server) => {
    server.post("/v1/userDeviceInfo/create", verifyToken, create);
    server.get("/v1/userDeviceInfo/search", verifyToken, search);
    server.put("/v1/userDeviceInfo/status/:id", verifyToken, statusUpdate);
    server.put("/v1/userDeviceInfo/:id", verifyToken, update);
	server.del("/v1/userDeviceInfo/bulkDelete", verifyToken, bulkDelete);
}
