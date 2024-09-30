/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const create = require("./create");
const search = require("./search");
const get = require("./get");
const update = require("./update");
const del = require("./delete");
const updateStatus = require("./updateStatus");
const productFilterList = require("./productFilterList");
const GetStoreByIpAddress = require ("./GetStoreByIpAddress");
const GetStoreByGeoLocation = require("./GetStoreByGeoLocation")
const list = require("./list");
const getLocationByRole = require("./getLocationByRole");
const getLocationByIPandGeoLocation = require("./getLocationByIPandGeoLocation");
const updateSortOrder = require("./updateSortOrder");

module.exports = (server) => {
// Location API routes
server.get("/v1/location/search", verifyToken, search);
server.get("/v1/location/list", verifyToken, list);
server.get("/v1/location/productList/search/:id", verifyToken, productFilterList);
server.get("/v1/location/getLocationByRole", verifyToken, getLocationByRole);
server.post("/v1/location", verifyToken, create);
server.get("/v1/location/:id", verifyToken, get);
server.put("/v1/location/:id", verifyToken, update);
server.del("/v1/location/:id", verifyToken, del);
server.put("/v1/location/status/:id", verifyToken, updateStatus);
server.get("/v1/location/ipAddress", verifyToken, GetStoreByIpAddress);
server.get("/v1/location/geoLocation", verifyToken, GetStoreByGeoLocation);
server.get("/v1/location/getLocationByIPandGeoLocation", verifyToken, getLocationByIPandGeoLocation);
server.put("/v1/location/order", verifyToken, updateSortOrder);
}