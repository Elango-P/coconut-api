const { Jobs } = require("../../db").models;
const errors = require("restify-errors");
const JobDetails = require("./jobDetails");
const Request = require("../../lib/request");

function get(req, res, next) {
  const id = req.params.id;
  let company_id = Request.GetCompanyId(req);
  
  Jobs.findOne({
    where: { id, company_id },
  })
    // eslint-disable-next-line new-cap
    .then((jobs) => res.json(JobDetails(jobs)));
}
module.exports = get;
