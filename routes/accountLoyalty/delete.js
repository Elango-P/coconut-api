const Permission = require("../../helpers/Permission");
const accountLoyaltyService = require("../../services/accountLoyaltyservice");


async function del(req, res, next) {
    try{
      
        await accountLoyaltyService.del(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = del;