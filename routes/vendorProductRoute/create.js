
const ObjectName = require("../../helpers/ObjectName");
const { CREATE_SUCCESS, BAD_REQUEST } = require("../../helpers/Response");
const Number = require("../../lib/Number");
const Request = require("../../lib/request");
const History = require("../../services/HistoryService");
const { vendorProduct } = require("../../db").models;



async function createVendorProduct(req, res, next) {
  try {
    const data = req.params;
    const companyId = Request.GetCompanyId(req);
    const name = data.name.trim();
    const vendorExist = await vendorProduct.findOne({

      where: { name, vendor_id: data.vendor_id, company_id: companyId, product_id: data.product_id },
    });
    if (vendorExist) {
      return res.json(BAD_REQUEST, { message: "Vendor already exist", });
    }
    const vendorData = {
      name: data.name,
      vendor_url: data.url,
      vendor_id: Number.Get(data.vendor_id),
      company_id: companyId,
      product_id: Number.Get(data.product_id)
    };
    const vendorDetails = await vendorProduct.create(vendorData);

    res.json(CREATE_SUCCESS, { message: "Vendor Product Added", vendorDetails: vendorDetails });
    
    res.on("finish", async () => {
      History.create(`Vendor Product Added`, req, ObjectName.VENDOR_PRODUCT, vendorDetails.id)
    })


  } catch (err) {
    console.log(err);
  }
}

module.exports = createVendorProduct;