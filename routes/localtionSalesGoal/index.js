const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const search = require("./search");
const update = require("./update");


module.exports = (server) => {
    server.post("/v1/locationSalesGoal/create", verifyToken, create);
    server.get("/v1/locationSalesGoal/search", verifyToken, search);
    server.del("/v1/locationSalesGoal/delete/:id", verifyToken, del);
    server.put("/v1/locationSalesGoal/update/:id", verifyToken, update);


};