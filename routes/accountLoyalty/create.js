const Permission = require("../../helpers/Permission");
const accountLoyaltyService = require("../../services/accountLoyaltyservice");


async function create(req, res, next) {
    try{
      
        await accountLoyaltyService.create(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = create;