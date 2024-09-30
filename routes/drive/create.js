const validator = require("../../lib/validator");
const utils = require("../../lib/utils");
const { Drive } = require("../../db").models;
const path = require("path");
const s3 = require("../../lib/s3");
const errors = require("restify-errors");
const fs = require("fs");

function create(req, res, next) {
  const data = req.body;

  const validations = [
    { value: data.ownerId, label: "owner name", type: "integer" },
    { value: data.categoryId, label: "category name" },
    { value: data.title, label: "title" },
  ];

  validator.validateFields(validations, (err) => {
    if (err) {
      return next(err);
    }

    const title = data.title;
    Drive.findOne({ where: { title } }).then((drivesExistCount) => {
      if (drivesExistCount) {
        return next(new errors.BadRequestError("File already exist"));
      }

      const file = req.files.file;

      Drive.create({
        category_id: data.categoryId,
        owner_id: data.ownerId,
        title: utils.rawURLEncode(data.title),
        updated_by: req.user.id,
      })
        .then((drives) => {
          const mediaName = `${drives.get("id")} - (${
            data.title
          })${path.extname(file.name)}`;
          drives.media_name = mediaName;
          s3.uploadFile(file.path, `media/drives/${mediaName}`, (err) => {
            if (err) {
              return next(err);
            }

            fs.unlink(file.path, () => {
              drives.save().then(() => {
                res.json(201, {
                  message: "File added",
                });
              });
            });
          });
        })
        .catch((err) => {
          req.log.error(err);
          console.log(err);
          return next(err);
        });
    });
  });
}

module.exports = create;
