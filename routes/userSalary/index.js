const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const list = require("./search");
const update = require("./update");




module.exports = (server) => {
    server.post("/v1/userSalary/create", verifyToken, create);
    server.get("/v1/userSalary/search", verifyToken, list);
    server.put("/v1/userSalary/:id", verifyToken, update);
    server.get("/v1/userSalary/get/:id", verifyToken, get);
    server.del("/v1/userSalary/del/:id", verifyToken, del);




    
};