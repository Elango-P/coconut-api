const verifyToken = require("../../middleware/verifyToken");
const { search } = require("../../services/MessageChannelService");
const create = require("./create");

module.exports = (server) => {
  server.post("/v1/messageChannel/create", verifyToken, create);
  server.get("/v1/messageChannel/search", verifyToken, search);
};