const errors = require("restify-errors");

// Validator
const validator = require("../../lib/validator");

// S3
const s3 = require("../../lib/s3");

// Models
const { UserTemperature } = require("../../db").models;

function del(req, res, next) {
  const userTemperaturId = req.params.userTemperatureId;

  if (!validator.isInteger(userTemperaturId)) {
    return next(new errors.BadRequestError("Invalid User temperature id"));
  }

  UserTemperature.findOne({
    attributes: ["id", "user_id", "image", "date", "temperature"],
    where: { id: userTemperaturId },
  }).then((userTemperature) => {
    if (!userTemperature) {
      return next(new errors.NotFoundError("User Temperature not found"));
    }

    userTemperature
      .destroy()
      .then(() => {
        s3.delFile(
          `media/user-temperature/${userTemperature.user_id}/${userTemperature.image}`,
          (err) => {
            if (err) {
              return next(err);
            }
            res.json({ message: "User temperature deleted" });
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
