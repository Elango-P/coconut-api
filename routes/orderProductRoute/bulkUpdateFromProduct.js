const Response = require("../../helpers/Response");
const Number = require("../../lib/Number");
const DataBaseService = require("../../lib/dataBaseService");
const Request = require("../../lib/request");
const { calculateProfitAmount } = require("../../services/OrderProductService");
const { orderProduct: orderProductModal, productIndex } = require("../../db").models;

const orderProduct = new DataBaseService(orderProductModal);

const bulkUpdateFromProduct = async (req, res, next) => {
  try {
    let body = req.body;
    let companyId = Request.GetCompanyId(req);
    let orderProductIds = body?.orderProductIds && JSON.parse(body?.orderProductIds);

    if (!orderProductIds || !orderProductIds.orderProductIds || orderProductIds.orderProductIds.length === 0) {
      return res.json(Response.BAD_REQUEST, { message: "Order Product Id is Required" });
    }
    let orderProductDetail;
    let profitAmount;
    let updateData;
    if (orderProductIds && orderProductIds.orderProductIds && orderProductIds.orderProductIds.length > 0) {
      for (let i = 0; i < orderProductIds.orderProductIds.length; i++) {
        const orderProductId = orderProductIds.orderProductIds[i];
        orderProductDetail = await orderProduct.findOne({
          where: { id: orderProductId, company_id: companyId },
          include: [
            {
              required: false,
              model: productIndex,
              as: "productIndex",
            },
          ],
        });

        profitAmount = calculateProfitAmount(orderProductDetail?.productIndex?.cost, orderProductDetail?.productIndex?.sale_price, orderProductDetail.quantity ? orderProductDetail.quantity : 1)
        updateData = {
          profit_amount: profitAmount,
          cost_price: orderProductDetail?.productIndex?.cost,
        };
        orderProductDetail.update(updateData);
      }
    }

    res.json(Response.OK, {
      message: "Order Product Updated",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = bulkUpdateFromProduct;
