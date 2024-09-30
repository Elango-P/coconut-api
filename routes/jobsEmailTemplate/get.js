// Models
const { JobEmailTemplate } = require("../../db").models;
const errors = require("restify-errors");

function get(req, res, next) {
  const id = req.params.id;

  if (!id) {
    return next(new errors.BadRequestError("Template id is required"));
  }

  JobEmailTemplate.findById(id)
    .then((templates) => {
      // Template Not Found
      if (!templates) {
        return next(new errors.BadRequestError("Template not found"));
      }

      // Template Details
      const data = {
        id: templates.id,
        name: templates.name,
        content: templates.content,
      };

      res.json(data);
    })
    .catch((err) => {
      return next(new errors.BadRequestError(err));
    });
}

module.exports = get;
