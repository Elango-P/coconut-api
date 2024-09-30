const verifyToken = require("../../middleware/verifyToken");

// Route dependencies

const list = require("./list")

module.exports = (server) => {
    server.get("/v1/storeProductReport/search", verifyToken, list);

};
