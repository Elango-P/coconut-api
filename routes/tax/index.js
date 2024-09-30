const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search");
const update = require("./update");
const del = require("./delete");
module.exports = (server) => {
  server.post("/v1/tax/create", verifyToken, create);
  server.get("/v1/tax/search", verifyToken, search);
  server.put("/v1/tax/:id", verifyToken, update);
  server.del("/v1/tax/:id", verifyToken, del);

};