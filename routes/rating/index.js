const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const search = require("./search");
const update = require("./update");


module.exports = (server) => {
    server.post("/v1/rating", verifyToken, create);
    server.get("/v1/rating/search", verifyToken, search);
    server.put("/v1/rating/update/:id", verifyToken, update);
    server.get("/v1/rating/:id", verifyToken, get);
    server.del("/v1/rating/delete/:id", verifyToken, del);

};