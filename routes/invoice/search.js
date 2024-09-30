const Request = require("../../lib/request");
const invoiceService = require("../../services/invoiceService");

const Report = async (req, res, next) => {
  try {
    const params = req.query;

    const data = await invoiceService.search(params,req);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};

module.exports = Report;
