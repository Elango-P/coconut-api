



const AccountEntryService = require("../../services/AccountEntryService");
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");


 async function List(req, res, next){
  try{
  

  AccountEntryService.search(req, res, next)
}catch(error){
  console.log(error);
}
};
module.exports = List;