const Response = require("../../helpers/Response");
const { fineService } = require("../../services/FineBonusService");
const Permission = require("../../helpers/Permission");



async function updateStatus(req, res, next) {

    try{
        fineService.updateStatus(req, res, next)
    } catch(err){
        console.log(err);
    }
}
module.exports = updateStatus;
