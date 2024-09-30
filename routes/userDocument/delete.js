const errors = require("restify-errors");

// Validator
const validator = require("../../lib/validator");

// S3
const s3 = require("../../lib/s3");

// Models
const { UserDocument } = require("../../db").models;

function del(req, res, next) {
  const id = req.params.userDocumentId;

  if (!validator.isInteger(id)) {
    return next(new errors.BadRequestError("Invalid User Document id"));
  }

  UserDocument.findOne({
    attributes: ["id", "user_id", "document_type", "document_url"],
    where: { id },
  }).then((userDocument) => {
    if (!userDocument) {
      return next(new errors.NotFoundError("User Document not found"));
    }

    userDocument
      .destroy()
      .then(() => {
        s3.delFile(
          `media/user-document/${userDocument.user_id}/${userDocument.document_url}`,
          (err) => {
            if (err) {
              return next(err);
            }
            res.json({ message: "User Document deleted" });
          }
        );
      })
      .catch((err) => {
        req.log.error(err);
        return next(err);
      });
  });
}

module.exports = del;
