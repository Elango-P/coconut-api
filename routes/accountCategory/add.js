const restify = require("restify");
const utils = require("../../lib/utils");
const errors = require("restify-errors");
const { AccountCategory } = require("../../db").models;
const {
  ACTIVE_STATUS,
  IN_ACTIVE_STATUS,
  IN_ACTIVE,
  ACTIVE,
} = require("../../helpers/AccountCategory");

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function add(req, res, next) {
  const data = req.body;
  const categoryName = data.categoryName;

  if (!categoryName) {
    return cb();
  }


  if (!categoryName) {
    return next(new errors.BadRequestError("Category name is required"));
  }
  AccountCategory.findOne({
    attributes: ["name", "id"],
    where: { name: categoryName },
  }).then((data) => {
    if (data) {
      return next(new errors.BadRequestError("Account category already Exist"));
    }

    AccountCategory.create({
      name: categoryName,
      status: ACTIVE_STATUS,
    }).then(() => {
      res.json(200, {
        message: "Account category created",
      });
    });
  });
}

module.exports = add;
