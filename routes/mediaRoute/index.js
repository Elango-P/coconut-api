const verifyToken = require("../../middleware/verifyToken");
const verifySchedulerAuthorization = require("../../middleware/verifySchedulerAuthorization");

// Route dependencies
const getImage = require("./get");
const search = require("./search");
const getDetail = require("./getDetail")
const update = require("./update")
const del = require("./delete")
const updateS3Image = require("./updateS3Image");
const create = require("./create");
const productMediaSearch = require("./productMediaSearch");
const bulkUpdate = require("./bulkUpdate");
const bulkDelete = require("./bulkDelete");
module.exports = (server) => {
    server.get("/v1/media/:id", getImage);
    server.get("/v1/media/search", verifyToken, search);
    server.get("/v1/media/get/:id", verifyToken, getDetail);
    server.put("/v1/media/:id", verifyToken, update);
    server.del("/v1/media/:id", verifyToken, del);
    server.post("/v1/scheduler/updateACH/manualRun", verifyToken, updateS3Image);
    server.post("/v1/scheduler/updateACH", verifySchedulerAuthorization, updateS3Image);
    server.post("/v1/media", verifyToken, create);
    server.get("/v1/media/product/search", verifyToken, productMediaSearch);
    server.put("/v1/media/bulk/update", verifyToken, bulkUpdate);
    server.put("/v1/media/bulk/delete", verifyToken, bulkDelete);



}
