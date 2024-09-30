const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const get = require("./get");
const getFile = require("./getFile");
const add = require("./add");
const message = require("./message");
const bulkMessage = require("./bulkMessage");
const update = require("./update");
const bulkUpdate = require("./bulkUpdate");
const getAvatar = require("./getAvatar");
const bulkDelete = require("./bulkDelete");
const del = require("./delete");
const updateStatuses =require("./updateStatus")
module.exports = (server) => {
	server.get("/candidate/v1/list", verifyToken, list);
	server.get("/candidate/v1/:id", verifyToken, get);
	server.get("/candidate/v1/getFile/:fileName", getFile);
	server.post("/candidate/v1",verifyToken, add);
	server.put("/candidate/v1/:id", verifyToken, update);
	server.put("/candidate/v1/bulkUpdate/:candidateId", verifyToken, bulkUpdate);
	server.get("/candidate/v1/avatar/:mediaName", getAvatar);
	server.post("/candidate/message/v1/:candidateId", verifyToken, message);
	server.post("/candidate/v1/bulkMessage", verifyToken, bulkMessage);
	server.del("/candidate/v1/bulkDelete/:id", verifyToken, bulkDelete);
	server.del("/candidate/v1/:id", verifyToken, del);
    server.put("/candidate/v1/status/:id", verifyToken,updateStatuses);
};
