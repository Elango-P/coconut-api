const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const channelMessageCreate = require("./channelMessageCreate");
const channelMessageSearch = require("./channelMessageSearch");
const search = require("./search");
const getdetail = require("./get");
const update = require("./update");
const del = require("./delete");
const getDetails = require("./get")
const unRead = require("./unRead");
module.exports = (server) => {
  server.post("/v1/message/create", verifyToken, create);
  server.get("/v1/message/search", verifyToken, search);
  server.get("/v1/message/unRead", verifyToken, unRead);
  server.put("/v1/message/:id/:messageId", verifyToken, update);
  server.del("/v1/message/:id/:messageId", verifyToken, del);
  server.get("/v1/message/:reciever_user_id", verifyToken, getDetails);
  server.post("/v1/channelMessage/create", verifyToken, channelMessageCreate);
  server.get("/v1/channelMessage/search", verifyToken, channelMessageSearch);
};