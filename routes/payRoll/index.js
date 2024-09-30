const verifyToken = require("../../middleware/verifyToken");
const del = require("./del");
const get = require("./get");
const create = require("./create");
const list = require("./list");
const update = require("./update");

module.exports = (server) => {
  server.post("/payroll/v1/", verifyToken, create);
  server.get("/payroll/v1/list", verifyToken, list);
  server.get("/payroll/v1/:id", verifyToken, get);
  server.put("/payroll/v1/:id", verifyToken, update);
  server.del("/payroll/v1/:id", verifyToken, del);
};
