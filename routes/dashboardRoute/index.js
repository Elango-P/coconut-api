
const verifyToken = require("../../middleware/verifyToken");
const getRoute = require("./storeDashboardCount");
const jobRoute = require("./jobDashboardCount");
const userRoute = require("./userDashboardCount")

module.exports = (server) => {
    server.get("/v1/dashboardRoute", verifyToken, getRoute);
    server.get("/v1/dashboardRoute/Job", verifyToken, jobRoute);
    server.get("/v1/dashboardRoute/User", verifyToken, userRoute);
} 