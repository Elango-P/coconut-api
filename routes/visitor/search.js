const Permission = require("../../helpers/Permission");
const VisitorService  = require("../../services/VisitorService");


async function search(req, res, next) {
    try{
       
        await VisitorService.search(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = search;