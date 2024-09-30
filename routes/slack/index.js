/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");
// Route dependencies
const getChannelList  = require("./getChannelList");
const getUserList = require("./getUserList");
const slackAuth = require("./slackAuth");
const slackConnect = require("./slackConnect");
const slackStatus = require("./slackStatus")

module.exports = (server) => {
    server.get("/v1/slack/channel/list",verifyToken, getChannelList); 
    server.get("/v1/slack/user/list",verifyToken, getUserList);
    server.post("/v1/slack/auth",verifyToken, slackAuth);
    server.get("/v1/slack/connect", slackConnect);  
    server.get("/v1/slack/status",verifyToken,slackStatus)
}
