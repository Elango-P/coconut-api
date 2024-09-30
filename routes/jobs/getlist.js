const { Jobs } = require("../../db").models;
const { Op } = require("sequelize");
const Request = require("../../lib/request");

function list(req, res) {
  const data = req.query;
  let company_id = Request.GetCompanyId(req);

  const where = { status: 1 };
  const category = data.category;
  where.company_id = company_id
  if (category) {
    where.category = category;
  }

  const job_link = data.jobLink;
  if (job_link) {
    where.job_link = { [Op.like]: `${job_link}` };
  }

  Jobs.findAll({
    where,
    order: [["sort", "ASC"]],
  }).then((jobs) => {
    const jobsList = {};

    jobs.forEach((job) => {
      if (!jobsList[job.sub_category]) {
        jobsList[job.sub_category] = [];
      }

      jobsList[job.sub_category].push(job);
    });

    res.json(jobsList);
  });
}

module.exports = list;
