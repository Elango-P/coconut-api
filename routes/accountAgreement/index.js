const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const search = require("./search");
const update = require("./update");


module.exports = (server) => {
    server.post("/v1/accountAgreement", verifyToken, create);
    server.get("/v1/accountAgreement/search", verifyToken, search);
    server.put("/v1/accountAgreement/update/:id", verifyToken, update);
    server.get("/v1/accountAgreement/:id", verifyToken, get);
    server.del("/v1/accountAgreement/delete/:id", verifyToken, del);

};