const ReplenishmentService = require("../../services/ReplenishmentService")


async function list(req, res, next) {
  try {
    ReplenishmentService.list(req, res);
  } catch (err) {
    console.log(err);
  }
}
module.exports = list;
