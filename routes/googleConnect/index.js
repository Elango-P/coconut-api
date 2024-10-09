/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");
// Route dependencies
const googleAuth = require("./googleAuth");
const googleConnect = require("./googleConnect");
const googleStatus = require("./googleStatus")

module.exports = (server) => {
    server.post("/v1/google/auth",verifyToken, googleAuth);
    server.get("/v1/google/connect", googleConnect);  
    server.get("/v1/google/status",verifyToken,googleStatus)
}
