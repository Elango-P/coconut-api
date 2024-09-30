const verifyToken = require("../../middleware/verifyToken");


const search = require("./search");
const create = require("./create");
const del = require("./delete");
const get = require("./get");
const update = require("./update");
const list=require("./list")
const stateCreate = require("./stateCreate");
const statedel = require("./stateDelete");
module.exports = (server) => {
    server.get("/v1/country/search", verifyToken, search);
    server.post("/v1/country", verifyToken, create);
    server.del("/v1/country/:id", verifyToken, del);
    server.get("/v1/country/:id", verifyToken, get);
    server.post("/v1/country/:id", verifyToken, update);
    server.post("/v1/state", verifyToken, stateCreate);
    server.get("/v1/country/list", verifyToken, list);
    server.del("/v1/state/:id/:country_id",verifyToken,statedel)
}