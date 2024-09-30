const verifyToken = require("../../middleware/verifyToken");

const createRoute = require("./create");
const serarchRoute = require("./search");

module.exports = (server) => {
    server.post("/v1/user/permission", verifyToken, createRoute);
    server.get("/v1/user/permission/search", verifyToken, serarchRoute);
}