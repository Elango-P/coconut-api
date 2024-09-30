// Models
const { Jobs } = require("../../../db").models;

const { Op } = require("sequelize");

function list(req, res) {
  const data = req.query;
  const where = { status: 1 };
  const category = data.category;
  where.company_id = Number(data.company_id)
  if (category) {
    where.category = category;
  }

  const slug = data.slug;
  if (slug) {
    where.slug = { [Op.like]: `${slug}` };
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
