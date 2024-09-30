const DataBaseService = require("../lib/dataBaseService");
const statusService = require("../services/StatusService");
const Request = require("../lib/request");
const Status = require("../helpers/Status");
const { reindex } = require("./ProductService");
const ProductPrice = require("../helpers/ProductPrice");
const ProductPriceService = require("./ProductPriceService");
const Number = require("../lib/Number");
const ObjectName = require("../helpers/ObjectName");
const DateTime = require("../lib/dateTime");
const history = require("./HistoryService");

const {
  Purchase,
  PurchaseProduct,
  ProductPrice: ProductPriceModel,
  productIndex,
  product,
  AccountProductModel,
  storeProduct
} = require("../db").models;

const PurchaseService = new DataBaseService(Purchase);

/**
 * Update Store details by storeId
 *
 * @param {*} PurchaseId
 * @param {*} data
 */
const updatePurchaseStatus = async (PurchaseId, data, req) => {
  try {
    const { status } = data;
    const company_id = Request.GetCompanyId(req);
    let purchaseData = await Purchase.findOne({ where: { id: PurchaseId, company_id: company_id } });
    // Update data
    const updateData = {
      status,
    };
    let statusData = await statusService.getData(status, company_id);

    if (statusData.due_date) {
      updateData.due_date = statusData.due_date;
    }

    let newStatus = statusData.name;

    const save = await Purchase.update(updateData, {
      where: { id: PurchaseId, company_id: company_id },
    });

    if (statusData && statusData.update_account_product == Status.UPDATE_ACCOUNT_PRODUCT_ENABLED) {
      let purchaseProductData = await PurchaseProduct.findAll({
        where: { purchase_id: PurchaseId },
        attributes: ["id", "product_id", "unit_price", "margin_percentage", "unit_margin_amount"],
      });

      let accountProductExists;

      if (purchaseProductData && purchaseProductData.length > 0) {
        for (let i = 0; i < purchaseProductData.length; i++) {
          accountProductExists = await AccountProductModel.findOne({
            where: {
              product_id: purchaseProductData[i].product_id,
              account_id: purchaseData && purchaseData.vendor_id,
              company_id: company_id,
            },
          });

          if (!accountProductExists) {
            await AccountProductModel.create({
              company_id: company_id,
              product_id: purchaseProductData[i].product_id,
              account_id: purchaseData && purchaseData.vendor_id,
            });
          }
        }
      }
    }

    if (statusData && statusData.update_product_price == Status.UPDATE_PRODUCT_PRICE_ENABLED) {
      let purchaseProductData = await PurchaseProduct.findAll({
        where: { purchase_id: PurchaseId, company_id: company_id },
        attributes: ["id", "product_id", "unit_price", "mrp", "unit_margin_amount", "barcode"],
      });


      for (let i = 0; i < purchaseProductData.length; i++) {

        let param = {
          productId: purchaseProductData[i] && purchaseProductData[i].product_id,
          companyId: company_id,
          unitPrice: purchaseProductData[i] && purchaseProductData[i].unit_price,
          marginAmount: purchaseProductData[i] && purchaseProductData[i].unit_margin_amount,
          barcode: purchaseProductData[i] && purchaseProductData[i]?.barcode,
          mrp: purchaseProductData[i] && purchaseProductData[i].mrp,
          date: purchaseData && purchaseData?.purchase_date,
        }
          let response =  await ProductPriceService.updatePrice(param)
          await  reindex(response?.productId, company_id);
          if (response.historyMessage && response.historyMessage.length > 0) {
            let message =response.historyMessage.join();
            history.create(message, req,  ObjectName.PRODUCT, purchaseProductData[i] && purchaseProductData[i]?.product_id);
          }
      }
    }
    if (statusData && statusData.update_quantity_in_location_product == Status.UPDATE_QUANTITY_IN_LOCATION_PRODUCT_ENABLED) {

      let purchaseProductData = await PurchaseProduct.findAll({
        where: { purchase_id: PurchaseId },
        attributes: ["id", "product_id", "quantity"],
      });

      let statusDetail = await statusService.Get(ObjectName.PURCHASE_PRODUCT, Status.GROUP_COMPLETED, company_id);

      if (purchaseProductData && purchaseProductData.length > 0) {

        for (let i = 0; i < purchaseProductData.length; i++) {

          let storeProductData = await storeProduct.findOne({ where: { store_id: purchaseData.store_id, product_id: purchaseProductData[i].product_id } })

          if (Number.Get(purchaseProductData[i].status) !== Number.Get(statusDetail.id)) {

            if (storeProductData.quantity !== purchaseProductData[i].quantity) {

              let quantity = Number.Get(storeProductData.quantity) + Number.Get(purchaseProductData[i].quantity)

              await storeProduct.update({ quantity: quantity }, { where: { id: storeProductData.id, company_id: company_id } })

            }
          }
        }
      }
    }

    return {
      save,
      newStatus: newStatus,
      statusData,
      purchaseData, 
    };
  } catch (err) {
    console.log(err);
  }
};

const getByBillId = async (billId, companyId) => {
  try {
    if (!billId) {
      throw { message: "Bill Id Not Found" };
    }

    if (!companyId) {
      throw { message: "CompanyId Id Not Found" };
    }

    let purchaseDetails = await PurchaseService.findOne({
      where: { bill_id: billId, company_id: companyId },
    });
    return purchaseDetails;
  } catch (err) {
    console.log(err);
  }
}

const get = async (purchaseId, companyId) => {
  try {
    if (!purchaseId) {
      throw { message: "Purchase Id Not Found" };
    }

    if (!companyId) {
      throw { message: "CompanyId Id Not Found" };
    }
    //get last purchase order
    let purchaseDetails = await PurchaseService.findOne({
      where: { id: purchaseId, company_id: companyId },
    });
    return purchaseDetails;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  updatePurchaseStatus,
  get,
  getByBillId,
};
