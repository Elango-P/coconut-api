// Models
const { JobEmailTemplate } = require("../../db").models;
const errors = require("restify-errors");

// Utils
const utils = require("../../lib/utils");

// Template List
const TemplateList = require("./templateList");

const { Op } = require("sequelize");

function list(req, res, next) {
  const data = req.query;
  let page = 1;
  let pageSize = 20;
  let { sortDir } = data;
  let where = {};

  const query = { where, limit: pageSize, offset: (page - 1) * pageSize };

  const sortableFields = {
    id: "id",
  };
  const sort = data.sort || "id";

  if (sort) {
    if (!Object.keys(sortableFields).includes(sort)) {
      return res.status(400).send({
        message: `Unable to sort candidate profile by ${sort}`,
      });
    }

    sortDir = sortDir || "ASC";
    const sortDirs = ["ASC", "DESC"];
    if (!sortDirs.includes(sortDir.toUpperCase())) {
      return next(new errors.BadRequestError("Invalid sort order"));
    }
    query.order = `${sortableFields[sort]} ${sortDir.toUpperCase()}`;
  }

  if (data.pagination) {
    page = data.page ? parseInt(data.page, 10) : 1;
    if (isNaN(page)) {
      return next(new errors.BadRequestError("Invalid page"));
    }

    pageSize = data.pageSize ? parseInt(data.pageSize, 10) : 20;
    if (isNaN(pageSize)) {
      return next(new errors.BadRequestError("Invalid page size"));
    }

    query.limit = pageSize;
    query.offset = (page - 1) * pageSize;
  }

  const searchText = data.search;
  if (searchText) {
    where[Op.or] = [
      {
        name: { [Op.like]: `%${searchText}%` },
      },
      {
        content: { [Op.like]: `%${searchText}%` },
      },
    ];
  }

  JobEmailTemplate.findAndCountAll(query)
    .then((templates) => {
      const count = templates.count;
      const lastPage = utils.getLastPage(count, pageSize);
      const data = templates.rows.map(TemplateList);

      res.json({
        count,
        page,
        sort,
        sortDir,
        pageSize,
        lastPage,
        data,
      });
    })
    .catch((err) => {
      return next(new errors.BadRequestError(err));
    });
}

module.exports = list;
