

const ShiftService = require("../../services/ShiftService");

const Request = require("../../lib/request");

async function search(req, res, next) {
  try{
    let companyId = Request.GetCompanyId(req);
    let timeZone = Request.getTimeZone(req);

    let query = req.query;

    let data = await ShiftService.search(companyId, query, timeZone );

    return res.send(data);

  } catch(err){
    console.log(err);
    return res.send(400, { message: err.message });
  }
}

module.exports = search;
