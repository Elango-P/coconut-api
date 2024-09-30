const errors = require("restify-errors");
const async = require("async");

// Validator
const validator = require("../../../lib/validator");

//  Email
const sendContactUsMail = require("./sendContactUsEmail");
const sendResponseMail = require("./sendResponseMail");

// Models
const { ContactUs } = require("../../../db").models;

function add(req, res, next) {
  const data = req.body;

  if (!data.fullName) {
    return next(new errors.BadRequestError("Full Name is required"));
  }

  if (!data.email) {
    return next(new errors.BadRequestError("Email is required"));
  }

  if (data.email && !validator.isEmail(data.email)) {
    return next(new errors.BadRequestError("Invalid Email"));
  }

  async.waterfall(
    [(cb) => sendContactUsMail(data, cb), (cb) => sendResponseMail(data, cb)],
    (err) => {
      if (err) {
        req.log.error(err);
        return next(err);
      }

      ContactUs.create({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        subject: data.subject,
        message: data.message,
      })
        .then(() => {
          res.json(201, {
            message: "Contact us sent successfully",
          });
        })
        .catch((err) => {
          req.log.error(err);
          next(err);
        });
    }
  );
}

module.exports = add;
