const get = require("./get");

module.exports = (server) => {
	server.get("/v1/public/pageBlock", get);
};
