const Permission = require("../../helpers/Permission");
const GatePassService = require("../../services/GatePassService");



async function update(req, res, next) {

    try{

        GatePassService.update(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = update;