const verifyToken = require("../../middleware/verifyToken");

//routes
const create = require("./create");
const search = require("./search");
const get = require("./get");
const del = require("./delete");
const update = require("./update");
const dashboard = require("./dashboard");
const List = require("./list.js");


module.exports = (server) => {
    server.post("/v1/paymentAccount", verifyToken, create);
    server.get("/v1/paymentAccount/:id", verifyToken, get);
    server.get("/v1/paymentAccount/search", verifyToken, search);
    server.del("/v1/paymentAccount/:id", verifyToken, del);
    server.put("/v1/paymentAccount/:id", verifyToken, update);
    server.get("/v1/paymentAccount/dashboard", verifyToken, dashboard);
    server.get("/v1/paymentAccount/list", verifyToken,List);

}