const errors = require("restify-errors");

// S3
const s3 = require("../../lib/s3");

// Models
const { Screenshot, User } = require("../../db").models;

// Utils
const { getIPAddress } = require("../../lib/utils");

function create(req, res, next) {
  const data = req.body;
  const { email, base64, systemName, version } = data;

  if (!email) {
    return next(new errors.BadRequestError("Email is required"));
  }

  if (!base64) {
    return next(new errors.BadRequestError("Screenshot is required"));
  }

  if (!systemName) {
    return next(new errors.BadRequestError("System name is required"));
  }

  if (!version) {
    return next(new errors.BadRequestError("Version is required"));
  }

  User.findOne({
    attributes: ["id"],
    where: { email, active: 1 },
  }).then((user) => {
    if (!user) {
      return next(
        new errors.BadRequestError(
          "This google account is not yet registered with us"
        )
      );
    }

    const { id: user_id } = user.get();

    const imagePath = `${Math.floor(Date.now())}.png`;
    s3.uploadBase64File(base64, `media/screenshot/${imagePath}`, (err) => {
      if (err) {
        return next(err);
      }

      Screenshot.create({
        user_id,
        system_name: systemName,
        ip_address: getIPAddress(req),
        image: imagePath,
        version,
      }).then(() => res.json({ message: "Screenshot uploaded" }));
    });
  });
}

module.exports = create;
