const restify = require("restify");
const errors = require("restify-errors");

// Models
const { AccountVendor } = require("../../db").models;

function update(req, res, next) {
  const data = req.body;
  const id = data.id;

  AccountVendor.findOne({
    attributes: ["name"],
  }).then((vendorDetails) => {
    if (!vendorDetails) {
      return next(new errors.NotFoundError("Vendor not found"));
    }

    AccountVendor.update(
      {
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
      },
      { where: { id } }
    ).then(() => {
      res.json({ message: "Vendor Updated" });
    });
  });
}
module.exports = update;
