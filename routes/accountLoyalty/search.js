const Permission = require("../../helpers/Permission");
const accountLoyaltyService = require("../../services/accountLoyaltyservice");


async function search(req, res, next) {
    try{
      
        await accountLoyaltyService.search(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = search;