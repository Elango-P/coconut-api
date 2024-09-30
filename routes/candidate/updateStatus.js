const { CandidateService } = require("../../services/candidateService");


async function updateStatus(req, res, next) {

    try{
         CandidateService.updateStatus(req, res, next)
    } catch(err){
        console.log(err);
    }
}
module.exports = updateStatus;
