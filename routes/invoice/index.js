const verifyToken = require("../../middleware/verifyToken");
const search = require("./search");
const createRefund = require("./createRefund");
module.exports = (server) => {
  server.get("/v1/invoice", verifyToken, search);
  server.post("/v1/invoice/createRefund", verifyToken, createRefund);
};
