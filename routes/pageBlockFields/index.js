
const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search");
const update = require("./update");
const del = require("./delete");


module.exports = (server) => {
    server.post("/v1/pageBlockFields/create", verifyToken, create);
    server.put("/v1/pageBlockFields/update/:id", verifyToken, update);
    server.get("/v1/pageBlockFields/search", verifyToken, search);
    server.del("/v1/pageBlockFields/delete/:id", verifyToken, del);
};
