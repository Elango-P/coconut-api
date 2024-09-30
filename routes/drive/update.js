const errors = require("restify-errors");
const fs = require("fs");

const s3 = require("../../lib/s3");
const validator = require("../../lib/validator");
const { Drive } = require("../../db").models;
const path = require("path");

function updateMedia(id, mediaName, image, data, callback) {
  const mediaFileName = `${data.id} - (${data.title})${
    path.extname(image.name)
      ? `${path.extname(image.name)}`
      : path.extname(mediaName)
  }`;
  const mediaUploadPath = `media/documents/${mediaFileName}`;

  if (image && image.name) {
    s3.delFile(`media/documents/${mediaName}`, (err) => {
      if (err) {
        return callback(err);
      }

      s3.uploadFile(image.path, mediaUploadPath, (err) => {
        if (err) {
          return callback(err);
        }

        fs.unlink(image.path, () => callback(null, mediaFileName));
      });
    });
  } else {
    s3.renameFile(`media/drives/${mediaName}`, mediaUploadPath, (err) => {
      if (err) {
        return callback(err);
      }

      return callback(null, mediaFileName);
    });
  }
}

function update(req, res, next) {
  const documentId = req.params.driveId;
  const data = req.body;

  const validations = [
    { value: documentId, label: "drives" },
    { value: data.ownerId, label: "owner name", type: "integer" },
    { value: data.categoryId, label: "category name" },
    { value: data.title, label: "title" },
  ];

  validator.validateFields(validations, (err) => {
    if (err) {
      return next(err);
    }

    const file = req.files.file;

    Drive.findOne({
      attributes: ["id", "media_name"],
      where: { id: documentId },
    }).then((drives) => {
      if (!drives) {
        return next(new errors.NotFoundError("File not found"));
      }

      updateMedia(
        drives.id,
        drives.media_name,
        file,
        data,
        (err, updatedFileName) => {
          if (err) {
            return next(err);
          }

          drives
            .update({
              owner_id: data.ownerId,
              category_id: data.categoryId,
              title: data.title,
              media_name: updatedFileName,
              updated_by: req.user.id,
            })
            .then(() => {
              res.json({
                message: "File updated",
              });
            })
            .catch((err) => {
              console.log(err);
              req.log.error(err);
              return next(err);
            });
        }
      );
    });
  });
}

module.exports = update;
