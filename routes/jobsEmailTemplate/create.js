// Model
const { JobEmailTemplate } = require("../../db").models;
const errors = require("restify-errors");

function create(req, res, next) {
  const data = req.body;

  JobEmailTemplate.findOne({
    where: { name: data.name },
  }).then((existTemplates) => {
    // Template Already Exists
    if (existTemplates) {
      return next(new errors.BadRequestError("Template already exists"));
    }

    // Create Template
    JobEmailTemplate.create({
      name: data.name,
      content: data.content,
    })
      .then(() => {
        return res.json({ message: "Template added" });
      })
      .catch((err) => {
        return next(new errors.BadRequestError(err));
      });
  });
}

module.exports = create;
