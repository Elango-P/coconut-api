const Permission = require("../../helpers/Permission");
const accountLoyaltyService = require("../../services/accountLoyaltyservice");


async function update(req, res, next) {
    try{
      
        await accountLoyaltyService.update(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = update;