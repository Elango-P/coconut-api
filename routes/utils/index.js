const verifyToken = require("../../middleware/verifyToken");
const getActivityTypes = require("./getActivityType");

module.exports = (server) => {

	server.get("/utils/v1/activityTypes", verifyToken, getActivityTypes);
};
