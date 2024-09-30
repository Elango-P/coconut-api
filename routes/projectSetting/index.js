const verifyToken = require("../../middleware/verifyToken");

const createRoute = require("./create");
const get = require("./get");
const search = require("./search");


module.exports = (server) => {
  server.put("/v1/projectSetting/create", verifyToken, createRoute);
  server.get("/v1/projectSetting/search", verifyToken, search);
  server.get("/v1/projectSetting/:name", verifyToken, get);

};
