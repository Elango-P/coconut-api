const SalaryService = require("../../services/SalaryService");

async function bulkDelete(req, res, next) {

    try{
        SalaryService.bulkDelete(req, res)
    } catch(err){
        console.log(err);
    }
}

module.exports = bulkDelete;