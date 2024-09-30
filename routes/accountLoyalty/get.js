const Permission = require("../../helpers/Permission");
const accountLoyaltyService = require("../../services/accountLoyaltyservice");


async function get(req, res, next) {
    try{
      
        await accountLoyaltyService.get(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = get;