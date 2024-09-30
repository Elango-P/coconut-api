const { JobEmailTemplate } = require("../../db").models;
const errors = require("restify-errors");

// Validator
const validator = require("../../lib/validator");

function del(req, res, next) {
  const templateId = req.params.id;

  // Validate Template
  if (!validator.isInteger(templateId)) {
    return next(new errors.BadRequestError("Invalid Template"));
  }

  JobEmailTemplate.findOne({
    where: { id: templateId },
  }).then((templateDetails) => {
    // Template Is Not Exists
    if (!templateDetails) {
      return next(new errors.BadRequestError("Template not found"));
    }

    // Delete Template
    templateDetails
      .destroy()
      .then(() => {
        return res.json({
          message: "Template deleted",
        });
      })
      .catch((err) => {
        return next(new errors.BadRequestError(err));
      });
  });
}
module.exports = del;
