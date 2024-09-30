
const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const search = require("./search");
const update = require("./update");
const updateSortOrder = require("./updatePreferredOrder");

module.exports = (server) => {
    server.post("/v1/preferredLocation/create", verifyToken, create);
    server.put("/v1/preferredLocation/update/:id", verifyToken, update);
    server.put("/v1/preferredLocation/order", verifyToken, updateSortOrder);
    server.get("/v1/preferredLocation/search", verifyToken, search);
    server.del("/v1/preferredLocation/delete/:id", verifyToken, del);
};
