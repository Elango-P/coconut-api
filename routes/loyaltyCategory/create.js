const Permission = require("../../helpers/Permission");
const LoyaltyCategoryService = require("../../services/LoyaltyCategoryServie");


async function create(req, res, next) {
    try{
      
        await LoyaltyCategoryService.create(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = create;