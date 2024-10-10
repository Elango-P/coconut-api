const Permission = require("../../helpers/Permission");
const GatePassService = require("../../services/GatePassService");


async function search(req, res, next) {
    try{

        await GatePassService.search(req, res, next)
    } catch(err){
        
        console.log(err);
    }
};

module.exports = search;