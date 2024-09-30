const ReplenishmentService = require("../../services/ReplenishmentService");

async function pendingList(req, res, next) {

  try {
    const params = req.query;

    let companyId = Request.GetCompanyId(req);
    let data =  await ReplenishmentService.pendingList(params, companyId, req.user.id);


    res.json(data);
  } catch (err) {
    console.log(err);
  }
}
module.exports = pendingList;
