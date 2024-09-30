const ShiftService = require("../../services/ShiftService");

const Request = require("../../lib/request");

async function currentShiftList(req, res, next) {
  try{
    let companyId = Request.GetCompanyId(req);

    let roleId = Request.getUserRole(req);

    let timeZone = Request.getTimeZone(req)

    let query = req.query;

    let data = await ShiftService.currentShiftList(companyId,timeZone, roleId, query );

    return res.send(data);

  } catch(err){
    console.log(err);
    return res.send(400, { message: err.message });
  }
}

module.exports = currentShiftList;
