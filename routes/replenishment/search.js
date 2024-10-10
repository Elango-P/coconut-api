const Permission = require("../../helpers/Permission");

const ReplenishmentService = require("../../services/ReplenishmentService")

async function search(req, res, next) {


    ReplenishmentService.search(req, res);
}
module.exports = search;
