const errors = require("restify-errors");
const fs = require("fs");
const path = require("path");

// S3
const s3 = require("../../lib/s3");

// Validator
const validator = require("../../lib/validator");

// Utils
const utils = require("../../lib/utils");

// Models
const { UserTemperature } = require("../../db").models;

function updateMedia(userId, mediaName, image, data, callback) {
  const mediaFileName = `${data.userId} - ${data.date} (${data.temperature})${
    utils.getExtensionByType(image.type)
      ? `.${utils.getExtensionByType(image.type)}`
      : path.extname(mediaName)
  }`;
  const mediaUploadPath = `media/user-temperature/${userId}/${mediaFileName}`;

  if (image && image.name) {
    s3.delFile(`media/user-temperature/${userId}/${mediaName}`, (err) => {
      if (err) {
        return callback(err);
      }

      s3.uploadFile(image.path, mediaUploadPath, (err) => {
        if (err) {
          return callback(err);
        }

        fs.unlink(image.path, () => {
          return callback(null, mediaFileName);
        });
      });
    });
  } else {
    s3.renameFile(
      `media/user-temperature/${userId}/${mediaName}`,
      mediaUploadPath,
      (err) => {
        if (err) {
          return callback(err);
        }

        return callback(null, mediaFileName);
      }
    );
  }
}

function getUserTemperature(oldUserTemperature, newUserTemperature, callback) {
  if (oldUserTemperature && newUserTemperature) {
    const old_value = [];
    const new_value = [];
    if (oldUserTemperature.user_id !== newUserTemperature.userId) {
      old_value.push(oldUserTemperature.user_id);
      new_value.push(oldUserTemperature.userId);
    }
    if (oldUserTemperature.date !== newUserTemperature.date) {
      old_value.push(oldUserTemperature.date);
      new_value.push(newUserTemperature.date);
    }
    if (oldUserTemperature.temperature !== newUserTemperature.temperature) {
      old_value.push(oldUserTemperature.temperature);
      new_value.push(newUserTemperature.temperature);
    }
    newUserTemperature.field = "Ticket Attachments";
    newUserTemperature.user_id = oldUserTemperature.user_id;
    newUserTemperature.original_value = old_value.join(",");
    newUserTemperature.new_value = new_value.join(",");
    return callback(null, newUserTemperature);
  }
  return callback();
}

function update(req, res, next) {
  const userTemperaturId = req.params.userTemperaturId;
  const data = req.body;

  const validations = [
    { value: userTemperaturId, label: "User Temperature id" },
    { value: data.userId, label: "User Id" },
    { value: data.temperature, label: "temperature" },
  ];

  validator.validateFields(validations, (err) => {
    if (err) {
      return next(err);
    }

    const image = req.files.image;

    if (image && image.name) {
      const imageType = utils.getExtensionByType(image.type);
      if (!imageType) {
        return next(new errors.BadRequestError("Invalid Image Type"));
      }
    }

    data.userId = utils.ucFirst(data.userId);
    data.date = utils.ucFirst(data.date);

    UserTemperature.findOne({
      attributes: [
        "id",
        "user_id",
        "date",
        "temperature",
        "image",
        "createdAt",
        "updatedAt",
      ],
      where: { id: userTemperaturId },
    }).then((userTemperature) => {
      if (!userTemperature) {
        return next(new errors.NotFoundError("user temperature not found"));
      }
      updateMedia(
        userTemperature.user_id,
        userTemperature.date,
        image,
        data,
        (err, updatedFileName) => {
          if (err) {
            return next(err);
          }
          getUserTemperature(
            userTemperature,
            data,
            (err, userTemperatureData) => {
              if (err) {
                next(err);
              }
              userTemperatureData.userTemperaturId = userTemperaturId;

              userTemperature
                .update({
                  user_id: data.userId,
                  date: data.date,
                  temperature: data.temperature,
                  image: updatedFileName,
                })
                .then(() => {
                  res.json({
                    message: "User Temperature updated",
                  });
                })
                .catch((err) => {
                  req.log.error(err);
                  return next(err);
                });
            }
          );
        }
      );
    });
  });
}

module.exports = update;
