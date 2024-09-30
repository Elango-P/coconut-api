const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const search = require("./search");
const statusUpdate = require("./statusUpdate");
const update = require("./update");


module.exports = (server) => {
// Location API routes
server.get("/v1/lead/search", verifyToken, search);
server.post("/v1/lead/create", verifyToken, create);
server.get("/v1/lead/:id", verifyToken, get);
server.put("/v1/lead/update/:id", verifyToken, update);
server.del("/v1/lead/delete/:id", verifyToken, del);
server.put("/v1/lead/status/:id", verifyToken, statusUpdate);
}