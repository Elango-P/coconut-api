const { login } = require("../../services/ecommUserService");
const category = require("./categoryRoute");
const signUp = require("./userRoute");

module.exports = (server) => {
	server.post("/v1/customer/login",login);
	server.post("/v1/customer/signup",signUp);
	server.get("/v1/category/list",category);
};
