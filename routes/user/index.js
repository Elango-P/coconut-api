const verifyToken = require("../../middleware/verifyToken");
const login = require("./login");
const logout = require("./logout");
const updateAvatar = require("./updateAvatar");
const forceLogout = require("./forceLogout");
const webLogin = require("./webLogin");
const mobileLogin = require("./mobileLogin");

const loginByAdmin = require("../user/loginByAdmin");
const forgotPassword =require("./forgotPassword");
const get =require("./get");
const update =require("./update");
const setPassword =require("./setPassword");
const getOtp =require("./getOtp");
// Route
const createRoute = require("./create");
const searchRoute = require("./search");
const getRoute = require("./getUser");
const updateRoute = require("./updateUser");
const deleteRoute = require("./delete");
const updateStatusRoute =require("./updateStatus");
const employmentCreateRoute =require("./userEmploymentCreate");
const employmentUpdateRoute =require("./userEmploymentUpdate")
const bulkUpdate =require("./bulkUpdate");
const list = require("./list");
const slackUpdate = require("./slackUpdate")
const loginAs = require("./loginAs")
const updateForceSync = require("./updateForceSync");
const projectUserList = require("./projectUserList");
const userLocationUpdate = require("./userLocationUpdate");
const userLocationGetRoute = require("./userLocationGet");
const listByRolePermission = require("./listByRolePermission");
const location = require("./location");
const signUp =require("./signUp");

module.exports = (server) => {
	server.get("/user/v1/", verifyToken, get);
	server.put("/user/v1", verifyToken, update);
	server.post("/user/v1/login", login);
	server.post("/user/v1/loginByPassword", webLogin);
    server.post("/user/v1/mobileLogin", mobileLogin);
	server.post("/user/v1/loginByAdmin", loginByAdmin);
	server.post("/user/v1/logout", verifyToken, logout);
	server.put("/v1/user/updateAvatar", verifyToken, updateAvatar);
	server.put("/user/v1/forceLogout", verifyToken, forceLogout);
	server.put("/user/v1/setPassword", setPassword)
	server.put("/user/v1/forgotPassword", forgotPassword );
    server.post("/user/v1/signUp", signUp);
                                                                          
	server.post("/user/v1", verifyToken, createRoute);
    server.get("/user/v1/search", verifyToken, searchRoute);
    server.get("/user/v1/list", verifyToken, list);
    server.get("/user/v1/:id", verifyToken, getRoute);
    server.put("/user/v1/:id", verifyToken, updateRoute);
    server.del("/user/v1/:id", verifyToken, deleteRoute);
    server.put("/user/v1/status/:id", verifyToken, updateStatusRoute);
    server.post("/v1/userEmployment/:id", verifyToken, employmentCreateRoute);
    server.put("/v1/userEmployment/update/:id", verifyToken, employmentUpdateRoute);
    server.put("/user/v1/bulkUpdate", verifyToken, bulkUpdate);
    server.put("/user/v1/slack/update/:id", verifyToken, slackUpdate);
	server.post("/user/v1/loginByAdmin/:id",verifyToken,loginAs)
	server.put("/user/v1/forceSync/:id", verifyToken, updateForceSync);
    server.get("/user/v1/project/user/list", verifyToken, projectUserList);
    server.put("/v1/userLocation/:id", verifyToken, userLocationUpdate);
    server.get("/v1/userLocation/:id", verifyToken, userLocationGetRoute);
    server.get("/user/v1/salesExecutive", verifyToken, listByRolePermission);
	server.get("/user/v1/location", verifyToken, location);
    server.post("/user/v1/getOtp", getOtp );




};
