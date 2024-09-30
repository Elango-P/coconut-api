const verifyToken = require("../../middleware/verifyToken");
const list = require("./list");
const create = require("./create");
const get = require("./get");
const update = require("./update");
const del = require("./delete");
const search = require("./search");
const getDetail = require("./getDetail");
const Productcreate = require("./productCreate");
const Productdelete = require("./productDelete");
const updateStatus = require("./updateStatus");
const Productupdate = require("./productUpdate");
const ProductuStatusUpdate = require("./updateProductStatus");
const productBulkupdate = require("./productBulkupdate");
const pending = require("./pending");
const purchaseProductList = require("./purchaseProductList");
const updateFromProduct = require("./updaterFromProduct");
const syncToAccountProduct = require("./syncToAccountProduct");
const syncToProduct = require("./syncToProduct");



module.exports = (server) => {
	server.get("/v1/purchase/search", verifyToken, list);
	server.post("/v1/purchase", verifyToken, create);
	server.get("/v1/purchase/:mediaName", get);
	server.put("/v1/purchase/:id", verifyToken, update);
	server.del("/v1/purchase/:id", verifyToken, del);
	server.get("/v1/purchase/detail/:id", verifyToken, getDetail);
	server.get("/v1/purchaseProduct/search", verifyToken, search);
	server.post("/v1/purchaseProduct", verifyToken, Productcreate);
	server.del("/v1/purchaseProduct/:id", verifyToken, Productdelete);
	server.put("/v1/purchase/status/:id", verifyToken, updateStatus);
	server.put("/v1/purchaseProduct/update/:id", verifyToken, Productupdate);
	server.put("/v1/purchaseProduct/bulkupdate", verifyToken, productBulkupdate);
	server.put("/v1/purchaseProduct/status/:id", verifyToken, ProductuStatusUpdate);
	server.get("/v1/purchase/pending", verifyToken, pending);
	server.get("/v1/purchaseProduct/list", verifyToken, purchaseProductList);
	server.get("/v1/purchaseProduct/updateFromProduct/:id", verifyToken, updateFromProduct);
	server.put("/v1/purchaseProduct/syncToAccountProduct", verifyToken, syncToAccountProduct);
	server.put("/v1/purchaseProduct/syncToProduct", verifyToken, syncToProduct);

	



};
