const restify = require("restify");

// Models
const { AccountVendor } = require("../../db").models;
const errors = require("restify-errors");

function statusChange(req, res, next) {
  const data = req.params;
  const vendorId = parseInt(data.id);
  const vendorStatus = parseInt(data.status);

  AccountVendor.findOne({
    attributes: ["email", "name", "status"],
    where: { id: vendorId },
  }).then((vendorDetails) => {
    if (!vendorDetails) {
      return next(new errors.NotFoundError("Vendor not found"));
    }

    AccountVendor.update(
      {
        status: vendorStatus,
      },
      { where: { id: vendorId } }
    ).then(() => {
      res.json({ message: "Status updated" });
    });
  });
}
module.exports = statusChange;
