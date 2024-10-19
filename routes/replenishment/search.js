const Permission = require("../../helpers/Permission");

const ReplenishmentService = require("../../services/ReplenishmentService")

async function search(req, res, next) {

    const hasPermission = await Permission.Has(Permission.REPLENISHMENT_VIEW, req);

    if (!hasPermission) {
      return res.json(400, { message: "Permission Denied" });
    }

    ReplenishmentService.search(req, res);
}
module.exports = search;
