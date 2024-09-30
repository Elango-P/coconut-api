/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");
const { search, update, updateVersionStatus } = require("../../services/AppVersionService");
const create = require("./create");
const del = require("./delete");


module.exports = (server) => {
// Tag API routes
server.post("/v1/appVersion", verifyToken, create);
server.get("/v1/appVersion/search", verifyToken, search);

server.put("/v1/appVersion", verifyToken, update);
server.del("/v1/appVersion/:id", verifyToken, del);
server.put("/v1/appVersion/status/:id", verifyToken, updateVersionStatus);
};
