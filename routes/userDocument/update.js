const errors = require("restify-errors");

// Models
const { UserDocument } = require("../../db").models;

function update(req, res, next) {
  const data = req.body;
  const userDocumentId = req.params.userDocumentId;

  if (!req.isAdmin) {
    return next(new errors.UnauthorizedError("Permission Denied"));
  }

  UserDocument.update(
    {
      document_type: data.documentType,
      status: data.status,
    },
    { where: { id: userDocumentId } }
  )
    .then(() => {
      res.json({
        message: "User Document Updated",
      });
    })
    .catch((err) => {
      req.log.error(err);
      return next(err);
    });
}

module.exports = update;
