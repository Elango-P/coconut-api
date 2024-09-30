const verifyAuthorization = require("../../middleware/verifyAuthorization");

const categories = require("./getCategories");

const getSetting = require("./getSetting");

const productListRoute = require("./productListRoute");

const accountCreate = require("./accountCreate");
const get = require("./getJobList");
const candidateCreate = require("./candidateCreate");
const createMedia = require("./createMedia");

module.exports = (server) => {

    server.get("/v1/public/categories", verifyAuthorization, categories);

    server.get("/v1/public/product", verifyAuthorization, productListRoute);

    server.get("/v1/public/setting", verifyAuthorization, getSetting);

    server.post("/v1/public/account", verifyAuthorization, accountCreate);
    server.get("/v1/public/jobs", get);
    server.post("/v1/public/candidate/create", candidateCreate);
    server.post("/v1/public/media/create", createMedia);


}
