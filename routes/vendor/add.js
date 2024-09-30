const restify = require("restify");
const utils = require("../../lib/utils");
const errors = require("restify-errors");

const { AccountVendor } = require("../../db").models;
const {
  ACTIVE_STATUS,
  IN_ACTIVE_STATUS,
  IN_ACTIVE,
  ACTIVE,
} = require("../../helpers/Account");

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function add(req, res, next) {
  const data = req.body;
  if (!data) {
    return cb();
  }
  if (!req.isAdmin && !req.isManager) {
    return next(new errors.UnauthorizedError("Permission Denied"));
  }

  if (!data.name) {
    return next(new errors.BadRequestError("name is required"));
  }

  AccountVendor.findOne({
    attributes: ["email"],
    where: { email: data.email },
  }).then((Vendordata) => {
    if (Vendordata) {
      return next(new errors.BadRequestError("vendor already Exist"));
    }

    AccountVendor.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      state: data.state,
      country: data.country,
      bank_name: data.bankName,
      bank_account_number: data.bankAccountNumber,
      bank_routing_number: data.bankRoutingNumber,
      address1: data.address1,
      address2: data.address2,
      status: ACTIVE_STATUS,
    }).then(() => {
      res.json(200, {
        message: "vendor created",
      });
    });
  });
}

module.exports = add;
