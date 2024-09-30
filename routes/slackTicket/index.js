const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const createWithAttachment = require("./createWithAttachment");

module.exports = (server) => {
  server.post("/slack/ticket/create", create);
  server.post("/slack/ticket/createWithAttachment", createWithAttachment);
};