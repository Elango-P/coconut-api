const verifyToken = require("../../middleware/verifyToken");
const search = require("./search");
const updateStatus = require("./updateStatus");


module.exports = (server) => {
  server.get("/v1/invoiceProduct", verifyToken, search);
  server.put("/v1/invoiceProduct/:id", verifyToken, updateStatus);
};
