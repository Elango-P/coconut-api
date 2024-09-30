// module dependencies
const verifyToken = require("../../middleware/verifyToken");

// Router middleware
const create = require("./create");
const get = require("./get");
const search = require("./search");
const update = require("./update");
const del = require("./delete");


// server
module.exports = (server) => {
    server.post("/v1/contact", verifyToken, create);
    server.get("/v1/contact/:id", verifyToken, get);
    server.get("/v1/contact/search", verifyToken, search);
    server.del("/v1/contact/delete/:id", verifyToken, del);
    server.put("/v1/contact/update/:id", verifyToken, update);
}