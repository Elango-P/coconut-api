const verifyToken = require("../../middleware/verifyToken");

//routes
const create = require("./create");
const search = require("./search");
const update = require("./update");
const updateByStatus = require("./updateByStatus");
const get = require("./get");
const del = require("./delete");
const ValidateSalesSettlementOnAdd = require("./ValidateSalesSettlementOnAdd");
const updateOrderAmount = require("./updateOrderAmount")

module.exports = (server) => {
    server.post("/v1/saleSettlement", verifyToken, create);
    server.get("/v1/saleSettlement/list", verifyToken, search);
    server.put("/v1/saleSettlement/:id", verifyToken, update);
    server.put("/v1/saleSettlement/status/:id", verifyToken, updateByStatus);
    server.get("/v1/saleSettlement/:id", verifyToken, get);
    server.del("/v1/saleSettlement/:id", verifyToken, del);
    server.get("/v1/saleSettlement/ValidationSalesSettlementOnAdd", verifyToken, ValidateSalesSettlementOnAdd);
    server.post("/v1/saleSettlement/updateOrderAmount", verifyToken, updateOrderAmount);

}