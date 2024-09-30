const errors = require("restify-errors");
const validator = require("../../lib/validator");
const s3 = require("../../lib/s3");
const { Drive } = require("../../db").models;

function del(req, res, next) {
  const documentId = req.params.driveId;

  if (!validator.isInteger(documentId)) {
    return next(new errors.BadRequestError("Invalid drives"));
  }

  Drive.findOne({
    attributes: ["id", "media_name"],
    where: { id: documentId },
  }).then((drives) => {
    if (!drives) {
      return next(new errors.NotFoundError("drives not found"));
    }

    drives
      .destroy()
      .then(() => {
        s3.delFile(`media/drives/${drives.media_name}`, (err) => {
          if (err) {
            return next(err);
          }
          res.json({ message: "File deleted" });
        });
      })
      .catch((err) => {
        console.log(err);
        req.log.error(err);
        return next(err);
      });
  });
}

module.exports = del;
