const errors = require("restify-errors");
const  Job = require("../../helpers/Job");
const { Jobs } = require("../../db").models;

function create(req, res, next) {
  const data = req.body;
  const companyId = Request.GetCompanyId(req);
  
  Jobs.findOne({ where: { job_title: data.title, company_id: companyId } }).then((existJobs) => {
    if (existJobs) {
      return next(new errors.NotFoundError("Job already exists"));
    }
    Jobs.findOne({
      order: [["sort", "DESC"]],
    }).then((sortcount) => {
      const sort = sortcount ? sortcount.sort : 0;
      const count = sort + 1;
      Jobs.create({
        
        job_title: data.title,
        status: Job.STATUS_ACTIVE ,
        slug: data.slug,
        company_id: companyId
      })
        .then(() => {
          res.json(201, {
            message: "Job added",
          });
        })
        .catch((err) => {
          req.log.error(err);
          next(err);
        });
    });
  });
}

module.exports = create;
