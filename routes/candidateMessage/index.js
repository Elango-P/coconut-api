const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const sendReplyMessage = require("./sendReplyMessage");
const bulkReply = require("./bulkReply");

module.exports = (server) => {
	server.get("/candidateMessage/v1/list", verifyToken, list);
	server.post(
		"/candidate/message/v1/reply",
		verifyToken,
		sendReplyMessage
	);
	server.post("/candidateMessage/v1/bulkReply", verifyToken, bulkReply);
	
};
