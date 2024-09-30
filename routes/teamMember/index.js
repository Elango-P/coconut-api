const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const search = require("./search");
const del = require("./del");
module.exports = (server) => {
  server.post("/v1/teamMember/create", verifyToken, create);
  server.get("/v1/teamMember/search", verifyToken, search);
  server.del("/v1/teamMember/:id", verifyToken, del);
};