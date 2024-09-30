const invoiceProductService = require("../../services/invoiceProductService");

const Report = async (req, res, next) => {
  try {
    await invoiceProductService.search(req, res);
  } catch (err) {
    console.log(err);
  }
};

module.exports = Report;
