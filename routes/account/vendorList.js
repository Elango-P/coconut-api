
const Permission = require("../../helpers/Permission");

const Response = require("../../helpers/Response");

const AccountService = require("../../services/AccountService")


async function GetVendorList(req, res, next) {

  try{

    const companyId = Request.GetCompanyId(req);
 
    if (!companyId) {
      return res.json(400, { message: 'Company Not Found' });
    }

        
    const data = await AccountService.getVendorList(companyId)
    res.json(Response.OK,{
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(Response.BAD_REQUEST).json({
      message: err.message
    });
  }
  
}
module.exports = GetVendorList;
