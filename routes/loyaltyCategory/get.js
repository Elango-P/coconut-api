const Permission = require("../../helpers/Permission");
const LoyaltyCategoryService = require("../../services/LoyaltyCategoryServie");


async function get(req, res, next) {
    try{
      
        await LoyaltyCategoryService.get(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = get;