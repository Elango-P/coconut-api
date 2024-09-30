


const ShiftService = require("../../services/ShiftService");

const Request = require("../../lib/request");

async function list(req, res, next) {
  try{
    let companyId = Request.GetCompanyId(req);

    let roleId = Request.getUserRole(req);

    let query = req.query;

    let data = await ShiftService.list(companyId, roleId, query );

    return res.send(data);

  } catch(err){
    console.log(err);
    return res.send(400, { message: err.message });
  }
}

module.exports = list;
