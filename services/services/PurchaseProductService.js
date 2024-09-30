const { Op } = require("sequelize");
const Number = require("../../lib/Number");
const ObjectName = require("../../helpers/ObjectName");
const History = require("../HistoryService");
const {
  PurchaseProduct,
  AccountProductModel,
  Purchase,
  productIndex,
  product,
  ProductPrice: ProductPriceModel,
} = require("../../db").models;
const statusService = require("../StatusService");
const DateTime = require("../../lib/dateTime");
const Status = require("../../helpers/Status");
const ProductPriceService = require("../ProductPriceService");
const ProductPrice = require("../../helpers/ProductPrice");
const { reindex } = require("../ProductService");

class PurchaseProductService {
  static async getTotalAmount(params) {
    let { companyId, purchaseId } = params;

    let totalAmount = await PurchaseProduct.sum("net_amount", {
      where: {
        company_id: companyId,
        purchase_id: purchaseId,
      },
    });

    return totalAmount;
  }

  static async getCount(purchaseId, companyId, vendorId) {
    try {
      if (!purchaseId) {
        throw { message: "Purchase Id Not Found" };
      }

      if (!companyId) {
        throw { message: "CompanyId Id Not Found" };
      }

      let dataArray = [];

      let purchaseProductData = await PurchaseProduct.findAll({
        where: { company_id: companyId, purchase_id: purchaseId },
        attributes: ["id", "purchase_id", "margin_percentage", "product_id"],
      });

      let data ={}
      if (purchaseProductData && purchaseProductData.length > 0) {
        for (let i = 0; i < purchaseProductData.length; i++) {
          dataArray.push({
            id: purchaseProductData[i].id,
            purchase_id: purchaseProductData[i].purchase_id,
            margin_percentage: purchaseProductData[i].margin_percentage,
            product_id: purchaseProductData[i].product_id,
          });
        }

        // Fetch accountProduct data based on companyId and product_id
        let accountProductData = await AccountProductModel.findAll({
          where: { company_id: companyId, account_id: vendorId, product_id: { [Op.in]: dataArray.map(item => item.product_id) } },
          attributes: ["id", "product_id", "margin_percentage", "account_id"],
        });

        // Compare margin_percentage values and count mismatches
        let matchCount = 0;
        let mismatchCount = 0;
        dataArray.forEach((item, index) => {
          const accountProductItem = accountProductData.find(
            (accountItem) => accountItem.product_id === item.product_id
          );

          if (accountProductItem &&Number.GetFloat( item.margin_percentage) !== Number.GetFloat(accountProductItem.margin_percentage)) {
            mismatchCount++;
          } else if (accountProductItem &&Number.GetFloat( item.margin_percentage) == Number.GetFloat(accountProductItem.margin_percentage)) {
            matchCount++;
          } 
        });
        data = { mismatchCount: mismatchCount, matchCount: matchCount }
      }
     data.productCount = dataArray.length
      return data
    } catch (err) {
      console.log(err);
    }
  }

  static async createAuditLog(oldData, newData, req) {
    let auditLogMessage = new Array();
    auditLogMessage.push(`Purchase Updated From: \n`);

    auditLogMessage.push(`Purchase Product: ${oldData?.product_id}\n`);

    if (oldData?.taxable_amount !== newData?.taxable_amount) {
      auditLogMessage.push(`Taxable Amount Updated to ${newData?.taxable_amount}\n`);
    }

    if (oldData?.mrp !== newData?.mrp) {
      auditLogMessage.push(`Mrp Updated to ${newData?.mrp}\n`);
    }

    if (oldData?.tax_amount !== newData?.tax_amount) {
      auditLogMessage.push(`Tax Amount Updated to ${newData?.tax_amount}\n`);
    }

    if (oldData?.net_amount !== newData?.net_amount) {
      auditLogMessage.push(`Net Amount Updated to ${newData?.net_amount}\n`);
    }

    if (oldData?.quantity !== Number.Get(newData?.quantity)) {
      auditLogMessage.push(`Quantity Updated to ${newData?.quantity}\n`);
    }

    if (oldData?.unit_price !== newData?.unit_price) {
      auditLogMessage.push(`Unit Price Updated to ${newData?.unit_price}\n`);
    }

    if (oldData?.margin_percentage !== newData?.margin_percentage) {
      auditLogMessage.push(`Margin Percentage Updated to ${newData?.margin_percentage}\n`);
    }

    if (oldData?.unit_margin_amount !== newData?.unit_margin_amount) {
      auditLogMessage.push(`Unit Margin Updated to ${newData?.unit_margin_amount}\n`);
    }

    if (auditLogMessage && auditLogMessage.length > 0) {
      let message = auditLogMessage.join();
      History.create(message, req, ObjectName.PURCHASE, oldData?.purchase_id);
    } else {
      History.create("Purchase Updated", req, ObjectName.PURCHASE, oldData?.purchase_id);
    }
  }
  static async syncToAccountProduct(params) {
    try {
      const { companyId, purchaseId, productId } = params;

      let purchaseData = await Purchase.findOne({ where: { id: purchaseId, company_id: companyId } });


      let purchaseProductData = await PurchaseProduct.findOne({
        where: { purchase_id: purchaseId, product_id: productId },
      });

      let accountProductExists;

      if (purchaseProductData) {
        accountProductExists = await AccountProductModel.findOne({
          where: {
            product_id: purchaseProductData.product_id,
            account_id: purchaseData && purchaseData.vendor_id,
            company_id: companyId,
          },
        });

        if (!accountProductExists) {
          await AccountProductModel.create({
            company_id: companyId,
            product_id: purchaseProductData.product_id,
            account_id: purchaseData && purchaseData.vendor_id,
            margin_percentage:Number.GetFloat(purchaseProductData.margin_percentage)
          });
        }else{
          await AccountProductModel.update({
            margin_percentage:Number.GetFloat(purchaseProductData.margin_percentage)
          },{where:{id:accountProductExists?.id}});
        }
      }


    } catch (err) {
      console.log(err);
    }
  }

  static async syncToProduct(params) {
    try {
      const { companyId, purchaseId, productId } = params;

      let purchaseData = await Purchase.findOne({ where: { id: purchaseId, company_id: companyId } });


      let purchaseProductData = await PurchaseProduct.findOne({
        where: { purchase_id: purchaseId, product_id: productId },
      });

      let param = {
        productId: purchaseProductData && purchaseProductData.product_id,
        companyId: companyId,
        unitPrice: purchaseProductData && purchaseProductData.unit_price,
        marginAmount: purchaseProductData && purchaseProductData.unit_margin_amount,
        barcode: purchaseProductData && purchaseProductData.barcode,
        mrp: purchaseProductData && purchaseProductData.mrp,
        date: purchaseData && purchaseData.purchase_date

      }

      let response = await ProductPriceService.updatePrice(param)
      await reindex(response?.productId, companyId);
      return {productId:response?.productId, historyMessage:response?.historyMessage}
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = PurchaseProductService;
