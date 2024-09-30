const Number = require("../lib/Number");
const DateTime = require("../lib/dateTime");

const { PurchaseProduct, Purchase, AccountProductModel } = require("../db").models;

const update = async (companyId, params) => {
  try {

    let where = {}

    where.company_id = companyId

    if(params && params.account_id){
      where.vendor_id = params.account_id
    }

    const products = await PurchaseProduct.findAll({
      where: where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          required: true,
          model: Purchase,
          as: "purchaseDetail",
          order: [["purchase_date", "DESC"]],
        },
      ],
    });

    if (!products) {
      throw { message: "Product not found" };
    }

    let accountProductData;

    for (let product of products) {
      try {
        accountProductData = await AccountProductModel.findOne({
          where: { company_id: companyId, product_id: product.product_id, account_id: product.vendor_id },
        });
        if (!accountProductData) {
          await AccountProductModel.create({
            company_id: companyId,
            product_id: product.product_id,
            account_id: product.vendor_id,
            margin_percentage: Number.GetFloat(product?.margin_percentage),
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = { update };
