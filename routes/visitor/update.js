const Permission = require("../../helpers/Permission");
const VisitorService  = require("../../services/VisitorService");



async function update(req, res, next) {

    try{
      
        VisitorService.update(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = update;