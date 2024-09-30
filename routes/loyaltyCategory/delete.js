const Permission = require("../../helpers/Permission");
const LoyaltyCategoryService = require("../../services/LoyaltyCategoryServie");


async function del(req, res, next) {
    try{
      
        await LoyaltyCategoryService.del(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = del;