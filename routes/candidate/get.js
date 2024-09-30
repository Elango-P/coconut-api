
const { CandidateService } = require("../../services/candidateService");


function get(req, res, next) {
  CandidateService.get(req,res,next)
}

module.exports = get;
