// Models
const { JobEmailTemplate } = require("../../db").models;
const errors = require("restify-errors");

function update(req, res, next) {
  const data = req.body;
  const id = req.params.id;

  if (!id) {
    return next(new errors.BadRequestError("Template id is required"));
  }

  JobEmailTemplate.findById(id)
    .then((Templates) => {
      // Get Job Details is not Exists
      if (!Templates) {
        return next(new errors.BadRequestError("Template not found"));
      }

      // Update Status
      return JobEmailTemplate.update(
        {
          name: data.name,
          content: data.content,
        },
        { where: { id } }
      ).then(() => {
        return res.json({ message: "Job updated" });
      });
    })
    .catch((err) => {
      return next(new errors.BadRequestError(err));
    });
}

module.exports = update;
