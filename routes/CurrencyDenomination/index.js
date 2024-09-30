const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const search = require("./search");
const update = require("./update");



module.exports = (server) => {
    server.post("/v1/CurrencyDenomination/create", verifyToken, create);
    server.get("/v1/CurrencyDenomination/search", verifyToken, search);
    server.put("/v1/CurrencyDenomination/update/:id", verifyToken, update);
    server.del("/v1/CurrencyDenomination/delete/:id", verifyToken, del);
};