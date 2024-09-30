const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const create = require("./create");
const get = require("./get");
const del = require("./del");
const update = require("./update");
const schedulerJobList = require("./schedulerJobList");
const updateLastExecutedAt = require("./updateLastExecutedAt");
const bulkUpdate = require("./bulkUpdate");
const bulkDelete = require("./bulkDelete");
const verifySchedulerAuthorization = require("../../middleware/verifySchedulerAuthorization");


module.exports = (server) => {
	server.get("/schedular/job/v1/list", verifyToken, list);
	server.get("/scheduler/jobs", verifySchedulerAuthorization, schedulerJobList);
	server.get("/schedular/job/v1/:id", verifyToken, get);
	server.post("/schedular/job/v1/", verifyToken, create);
	server.put("/schedular/job/v1/:id", verifyToken, update);
	server.put("/schedular/job/update/:id", verifySchedulerAuthorization, updateLastExecutedAt);
	server.del("/schedular/job/v1/:id", verifyToken, del);
	server.put("/schedular/job/v1/bulkUpdate", verifyToken, bulkUpdate);
	server.put("/schedular/job/v1/bulkDelete", verifyToken, bulkDelete);
};
