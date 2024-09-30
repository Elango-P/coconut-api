
const verifyToken = require("../../middleware/verifyToken");
const create = require("./create");
const verifyOtp = require("./verifyOtp");

module.exports = (server) => {
    server.post("/v1/otp/create", verifyToken, create);
    server.put("/v1/otp/validate", verifyToken, verifyOtp);

}