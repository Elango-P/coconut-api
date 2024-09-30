// const CandidateService  = require("../../services/services/billService");

const { CandidateService } = require("../../services/candidateService");

async function del(req, res, next) {
  try{
     CandidateService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;