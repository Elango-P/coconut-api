const errors = require("restify-errors");
const fs = require("fs");

// S3
const s3 = require("../../lib/s3");

// Validator
const validator = require("../../lib/validator");

// Utils
const utils = require("../../lib/utils");

// Models
const { UserTemperature } = require("../../db").models;

function create(req, res, next) {
  const data = req.body;

  const validations = [
    { value: data.userId, label: "user Id", type: "integer" },
    { value: data.date, label: "date" },
    { value: data.temperature, label: "Temperature" },
  ];

  validator.validateFields(validations, (err) => {
    if (err) {
      return next(err);
    }

    const image = req.files.image;

    if (!image || !image.name) {
      return next(new errors.BadRequestError("Image is required"));
    }

    const imageType = utils.getExtensionByType(image.type);
    if (!imageType) {
      return next(new errors.BadRequestError("Invalid Image Type"));
    }

    data.userId = utils.ucFirst(data.userId);
    data.date = utils.ucFirst(data.date);

    const mediaName = `${data.userId} - ${data.date} (${data.temperature}).${imageType}`;

    s3.uploadFile(
      image.path,
      `media/user-temperature/${data.userId}/${mediaName}`,
      (err) => {
        if (err) {
          return next(err);
        }

        fs.unlink(image.path, () => {
          UserTemperature.create({
            user_id: data.userId,
            temperature: data.temperature,
            date: data.date,
            image: mediaName,
          })
            .then(() => {
              res.json(201, {
                message: "User Temperature Added",
              });
            })
            .catch((err) => {
              req.log.error(err);
              return next(err);
            });
        });
      }
    );
  });
}

module.exports = create;
