const errors = require("restify-errors");

// Utils
const utils = require("../../lib/utils");

// Models
const { WikiPage, User } = require("../../db").models;

// Process Page
const processPage = require("./processPage");

function list(req, res, next) {
  const data = req.query;

  const page = data.page ? parseInt(data.page, 10) : 1;
  if (isNaN(page)) {
    return next(new errors.BadRequestError("Invalid page"));
  }

  const pageSize = data.pageSize ? parseInt(data.pageSize, 10) : 20;
  if (isNaN(pageSize)) {
    return next(new errors.BadRequestError("Invalid page size"));
  }

  const where = {};
  const query = {
    order: [["title", "ASC"]],
    limit: pageSize,
    offset: (page - 1) * pageSize,
    include: [
      {
        required: true,
        model: User,
        as: "createdBy",
        attributes: ["name"],
      },
      {
        required: false,
        model: User,
        as: "updatedBy",
        attributes: ["name"],
      },
    ],
    where,
  };

  WikiPage.findAndCountAll(query)
    .then((pageList) => {
      const { count, currentPage, lastPage, pageStart, pageEnd } =
        utils.getPageDetails(pageList.count, page, pageSize, pageList.length);
      pageList = pageList.rows.map(processPage);

      res.json({
        count,
        currentPage,
        lastPage,
        pageStart,
        pageEnd,
        pageList,
      });
    })
    .catch((err) => {
      console.log(err);
      req.log.error(err);
      next(err);
    });
}

module.exports = list;
