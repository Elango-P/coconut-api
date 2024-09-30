/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");


module.exports = (server) => {
    try{
    server.get("/v1/object/search", verifyToken, search);
    }
    catch(err){
        console.log(err);
    }

};
