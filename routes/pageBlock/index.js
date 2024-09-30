
const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search");
const updateSortOrder = require("./updateOrder");
const update = require("./update");
const del = require("./delete");


module.exports = (server) => {
    server.post("/v1/pageBlock/create", verifyToken, create);
    server.put("/v1/pageBlock/update/:id", verifyToken, update);
    server.put("/v1/pageBlock/sortOrder", verifyToken, updateSortOrder);
    server.get("/v1/pageBlock/search", verifyToken, search);
    server.del("/v1/pageBlock/delete/:id", verifyToken, del);
};
