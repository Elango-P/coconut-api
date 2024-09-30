const { Jobs } = require("../../db").models;
const utils = require("../../lib/utils");
const errors = require("restify-errors");
const Joblist = require("./joblist");
const { Op } = require("sequelize");
const Request = require("../../lib/request");

function list(req, res, next) {
  const data = req.query;
  const validOrder = ["ASC", "DESC"];
  const sortableFields = {
    jobTitle: "job_title",
    category: "category",
    subCategory: "sub_category",
    sort: "sort",
    id: "id",
  };
  const sort = data.sort || "created_at";
  const sortDir = data.sortDir || "DESC";
  const companyId = Request.GetCompanyId(req);

  const page = data.page ? parseInt(data.page, 10) : 1;
  if (isNaN(page)) {
    return next(new errors.BadRequestError("Invalid page"));
  }

  const pageSize = data.pageSize ? parseInt(data.pageSize, 10) : 20;
  if (isNaN(pageSize)) {
    return next(new errors.BadRequestError("Invalid page size"));
  }
  const where = {};

  const category = data.tag;
  if (category) {
    where.category = category;
  }

  const sub_category = data.sub_category;
  if (sub_category) {
    where.sub_category = sub_category;
  }

  const searchText = data.search;
  if (searchText) {
    where[Op.or] = [
      {
        job_title: { [Op.iLike]: `%${searchText}%` },
      },
    ];
  }
  const status = data.status;
  if (status) {
    where.status = status;
  }
  where.company_id = companyId;

  const experience = data.experience;
  if (experience) {
    where.experience = experience;
  }

  const query = {
    order: [[sort, sortDir]],
    limit: pageSize,
    offset: (page - 1) * pageSize,
    where,
  };
  Jobs &&
    Jobs.findAndCountAll(query)
      .then((jobs) => {
        const { count, currentPage, lastPage, pageStart, pageEnd } =
          utils.getPageDetails(jobs.count, page, pageSize, jobs.length);
        const data = jobs.rows.map(Joblist);
        res.json({
          totalCount: count,
          pageSize,
          currentPage,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        req.log.error(err);
      });
}

module.exports = list;
