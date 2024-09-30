const verifyAuthorization = require("../../../middleware/verifyAuthorization");
const get = require("./get");

module.exports = (server) => {
  server.get("/public/detail/v1", verifyAuthorization, get);
};
