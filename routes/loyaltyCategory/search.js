const Permission = require("../../helpers/Permission");
const LoyaltyCategoryService = require("../../services/LoyaltyCategoryServie");


async function search(req, res, next) {
    try{
      
        await LoyaltyCategoryService.search(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = search;