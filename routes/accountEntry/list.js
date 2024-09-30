



const AccountEntryService = require("../../services/AccountEntryService");
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");


 async function List(req, res, next){
  try{
  const hasPermission = await Permission.Has(Permission.ACCOUNT_ENTRY_VIEW, req);
  if (!hasPermission) {

    return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
  }

  AccountEntryService.search(req, res, next)
}catch(error){
  console.log(error);
}
};
module.exports = List;