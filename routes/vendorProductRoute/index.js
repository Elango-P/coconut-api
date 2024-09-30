/**
 * Module dependencies
 */
const verifyToken = require("../../middleware/verifyToken");

// Route dependencies
const search = require("./search");
const importVendorProduct = require("./importVendorProduct");
const exportToProduct = require("./exportToProduct");
const bulkUpdateVendorProductStatus = require("./bulkUpdateVendorProductStatus");
const bulkDelete = require("./bulkDelete");
const syncProductFromVendor = require("./syncProductFromVendor");
const syncAllProductFromVendor = require("./syncAllProductFromVendor");
const get = require("./get");
const update = require("./update");
const del = require("./delete");
const updateImportStatus = require("./updateImportStatus");
const productSearch = require("./productSearch");
const createProduct = require("./createProduct");
const productFilterList = require("./productFilterList");
const createVendorProduct = require("./create");

module.exports = (server) => {
    server.get("/v1/vendorProduct/productSearch", verifyToken, productSearch);
    server.post("/v1/vendorProduct/productAdd", verifyToken, createProduct);

    server.get("/v1/vendorProduct/search", verifyToken, search);
    server.get("/v1/vendorProduct/:id", verifyToken, get);

    server.post(
        "/v1/vendorProduct/create/product",
        verifyToken,
        exportToProduct
    );
    server.post("/v1/vendorProduct/import", verifyToken, importVendorProduct);
    server.post("/v1/vendorProduct", verifyToken, createVendorProduct);

    server.put("/v1/vendorProduct/import/status/:importStatus", verifyToken, updateImportStatus);
    server.put("/v1/vendorProduct/sync/all", verifyToken, syncAllProductFromVendor);
    server.put("/v1/vendorProduct/sync", verifyToken, syncProductFromVendor);
    server.put(
        "/v1/vendorProduct/bulk/update",
        verifyToken,
        bulkUpdateVendorProductStatus
    );
    server.put("/v1/vendorProduct/bulk/delete", verifyToken, bulkDelete);
    server.put("/v1/vendorProduct/:id", verifyToken, update);

    server.del("/v1/vendorProduct/:id", verifyToken, del);
    server.get("/v1/account/productList/search", verifyToken, productFilterList);


};