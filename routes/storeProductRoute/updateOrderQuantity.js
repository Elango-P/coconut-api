// Status
const ObjectName = require("../../helpers/ObjectName");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const Request = require("../../lib/request");

// Services
const locationProductService = require("../../services/locationProductService");
const History = require("../../services/HistoryService");


async function updateOrderQuantity (req, res, next){

    try {
      let { product_id } = req && req.params;
      let companyId = Request.GetCompanyId(req);

      await locationProductService.updateOrderQuantity(product_id, companyId);
      res.json(OK, { message: "Order Quantity Updated" });
      res.on("finish", () => {
        History.create("Order Quantity Updated", req, ObjectName.STORE_PRODUCT, product_id);
      });
    } catch (err) {
      console.log(err);
      res.json(BAD_REQUEST, { message: err.message });
    }
};

module.exports = updateOrderQuantity;
