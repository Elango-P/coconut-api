const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const ReplenishmentAllocationService = require("../../services/replenishmentAllocationService");

async function search(req, res, next) {
  try {
    await ReplenishmentAllocationService.report(req, res);
  } catch (err) {
    console.log(err);
  }
}
module.exports = search;
