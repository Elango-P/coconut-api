/**
 * Module dependencies
 */
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");
const Permission = require("../../helpers/Permission");
const ObjectName = require("../../helpers/ObjectName");

// Services
const { vendorProduct } = require("../../db").models;

//systemLog
const History = require("../../services/HistoryService");
const String = require("../../lib/string");

/**
 * Product update route
 */
async function update(req, res, next) {
  try {
    const data = req.body;
    const { id } = req.params;

    const companyId = req.user.company_id;

    const vendorDetails = await vendorProduct.findOne({
      where: { id, product_id: data.product_id, company_id: companyId },
    });

    if (!vendorDetails) {
      return res.json(BAD_REQUEST, { message: "Invalid account id", })
    }

    // Update product Data
    const updateData = {
      id: id,
      vendor_url: data.url ? data.url : data.vendor_url,
      product_id: data.product_id,
      vendor_id: data.vendor_id,
      price: data.price,
    }

    const save = await vendorDetails.update(updateData);

    History.create("Vendor Product Updated", req, ObjectName.VENDOR_PRODUCT, id);

    res.json(UPDATE_SUCCESS, { message: "Vendor Product Updated", data: save.get(), });
  } catch (err) {
    console.log(err);
    //create system log for updation

    res.json(BAD_REQUEST, { message: err.message });
  }
}
module.exports = update;
