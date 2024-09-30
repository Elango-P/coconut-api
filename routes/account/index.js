/**
 * Module dependencies
 */
 const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");
const create = require("./create");
const get = require("./get");
const update = require("./update");
const del = require("./del");
const updateStatus = require("./updateStatus");
const searchByProduct = require("./searchByProduct");
const list = require("./list");
const vendorList = require("./vendorList");
const vendorSearch = require("./vendorSearch");
const createPurchaseOrder = require("./createPurchaseOrder");
const createVendor = require("./createVendor");
const createCustomer = require("./createCustomer");
const createEmployee = require("./createEmployee");
const bulkupdate = require("./bulkUpdate");


module.exports = (server) =>{
// Vendor Management API route
server.get("/v1/account/search", verifyToken, search);
server.get("/v1/account/list", verifyToken, list);
server.get("/v1/account/vendorSearch", verifyToken, vendorSearch);
server.get("/v1/account/vendorList",verifyToken,vendorList);
server.post("/v1/account", verifyToken, create);
server.post("/v1/account/createVendor", verifyToken, createVendor);
server.post("/v1/account/createCustomer", verifyToken, createCustomer);
server.post("/v1/account/createEmployee", verifyToken, createEmployee);
server.get("/v1/account/:id", verifyToken, get);
server.put("/v1/account/:id", verifyToken, update);
server.del("/v1/account/:id", verifyToken, del);
server.put("/v1/account/status/:id", verifyToken, updateStatus);
server.post("/v1/account/createPurchaseOrder", verifyToken, createPurchaseOrder);
server.put("/v1/account/bulkUpdate", verifyToken,bulkupdate)
}