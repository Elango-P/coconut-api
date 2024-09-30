const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const search = require("./search");
const update = require("./update");
const getPendingPayments = require("./getPendingPayments");


module.exports = (server) => {
    server.post("/v1/payment", verifyToken, create);
    server.get("/v1/payment/search", verifyToken, search);
    server.put("/v1/payment/update/:id", verifyToken, update);
    server.get("/v1/payment/:id", verifyToken, get);
    server.del("/v1/payment/delete/:id", verifyToken, del);
    server.get("/v1/payment/pending", verifyToken, getPendingPayments);

};