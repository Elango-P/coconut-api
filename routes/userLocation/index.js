
const verifyToken = require("../../middleware/verifyToken");

const create = require("./create");
const search = require("./search");

module.exports = (server) => {
    server.post("/v1/userLocation/create", verifyToken, create);
    server.get("/v1/userLocation", verifyToken, search);
}
