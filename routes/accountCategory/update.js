const restify = require("restify");
const errors = require("restify-errors");
// Models
const { AccountCategory } = require("../../db").models;

function update(req, res, next) {
  const data = req.body;
  const id = data.id;

  AccountCategory.findOne({
    attributes: ["id"],
    where: { id: data.id },
  }).then((accountCategory) => {
    if (!accountCategory) {
      return next(new errors.NotFoundError("Account category not found"));
    }

    AccountCategory.update(
      {
        name: data.categoryName,
      },
      { where: { id } }
    ).then(() => {
      res.json({ message: "Account Category updated" });
    });
  });
}
module.exports = update;
