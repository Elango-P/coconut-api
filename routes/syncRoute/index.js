/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");
const bulkUpdate = require("./bulkUpdate");
const update = require("./update");
const sync = require("./sync");
const forceSync = require("./forceSync");


module.exports = (server) => {
// Sync API routes
server.get("/v1/sync/search", verifyToken, search);
server.put("/v1/sync/bulk/update", verifyToken, bulkUpdate);
server.put("/v1/sync/update/:id", verifyToken, update);
server.get("/v1/sync", verifyToken, sync);
server.get("/v1/forceSync", verifyToken, forceSync);

};
