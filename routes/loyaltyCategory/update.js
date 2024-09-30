const Permission = require("../../helpers/Permission");
const LoyaltyCategoryService = require("../../services/LoyaltyCategoryServie");


async function update(req, res, next) {
    try{
      
        await LoyaltyCategoryService.update(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = update;