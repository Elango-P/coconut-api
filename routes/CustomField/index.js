const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const search = require("./search");
const update = require("./update");
const updateSortOrder = require("./updateSortOrder");


module.exports = (server) => {
    server.post("/v1/customField/create", verifyToken, create);
    server.get("/v1/customField/search", verifyToken, search);
    server.put("/v1/customField/order", verifyToken, updateSortOrder);
    server.put("/v1/customField/update/:id", verifyToken, update);
    server.del("/v1/customField/delete/:id", verifyToken, del);
};