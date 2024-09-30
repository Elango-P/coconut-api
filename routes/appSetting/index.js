const verifyToken = require("../../middleware/verifyToken");
const getRoute = require("./getRoute");
const saveRoute = require("./saveRoute");

module.exports = (server) => {
    server.put("/v1/appSetting", verifyToken, saveRoute);
    server.get("/v1/appSetting", verifyToken, getRoute);
}