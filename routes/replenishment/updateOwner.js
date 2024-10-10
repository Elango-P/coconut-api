const Permission = require("../../helpers/Permission");

const ReplenishmentService = require("../../services/ReplenishmentService")

// Lib
const Request = require("../../lib/request");

async function updateOwner(req, res, next) {

    try {
        
        let companyId = Request.GetCompanyId(req);

        let body = req.body;

        await ReplenishmentService.updateOwner(body, companyId);

        res.json(200, { message: "Owner Updated" })
    } catch (err) {
        console.log(err);
        res.json(400, { message: err.message })
    }
}
module.exports = updateOwner;
