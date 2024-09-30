const { Op, Sequelize } = require("sequelize");
const Location = require("../helpers/Location");
const ObjectName = require("../helpers/ObjectName");
const { getSettingValue } = require("./SettingService");
const StatusService = require("../services/StatusService");
const Status = require("../helpers/Status");
const Number = require("../lib/Number");
const Account = require("../helpers/Account");
const Product = require("../helpers/Product");
const User = require("../helpers/User");

const {
  purchaseOrderProductModal,
  purchaseOrderModal,
  productIndex,
  vendorProduct,
  storeProduct,
  Location: locationModel,
  AccountProductModel,
  account,
} = require("../db").models;

const updateQuantity = async (product_id, status, quantity, purchaseOrderId) => {

  try {

    let where = {}
    let purchaseOrderWhere = {}


    where.product_id = product_id

    if (status) {
      purchaseOrderWhere.status = status
    }
    if (purchaseOrderId) {
      purchaseOrderWhere.id = purchaseOrderId
    }

    let productData = await purchaseOrderProductModal.findOne({
      where: where,
      order: [["createdAt", "DESC"]],
      include: [{ model: purchaseOrderModal, as: "purchaseOrder", where: purchaseOrderWhere }],
    });

    if (productData) {
      let { purchase_order_id } = productData.dataValues

      await purchaseOrderProductModal.update(
        { quantity: quantity },
        { where: { product_id: product_id, purchase_order_id: purchase_order_id } }
      );
    }
  } catch (err) {
    console.log(err);
  }
}

const createPurchaseOrderProduct = async (params) => {
  try {

    const { vendorData, purchase_order_id, status, company_id } = params
    if(vendorData && vendorData.quantity > 0){
    let quantity;
    let productData = await productIndex.findOne({
      where: { product_id: vendorData.product_id, company_id: company_id, status: Product.STATUS_ACTIVE},
    });

    if(productData){
      
    if (productData.pack_size > 1) {
      if (vendorData.quantity > productData.pack_size) {
        let data = vendorData.quantity / productData.pack_size;

        quantity = Math.round(data) * productData.pack_size;
      } else if (vendorData.quantity < productData.pack_size) {
        let data = vendorData.quantity / productData.pack_size;

        if (data >= 0.75) {
          quantity = productData.pack_size;
        } else {
          quantity = vendorData.quantity;
        }
      }
    } else {
      quantity = vendorData.quantity;
    }
    let amount;
    if (productData && (productData.cost > 0 || productData.mrp > 0)) {
      amount = Number.GetFloat(productData.cost ? productData.cost : productData.mrp) * Number.Get(quantity);
    } else {
      amount = null;
    }
    if(quantity > 0){
    await purchaseOrderProductModal.create({
      purchase_order_id: purchase_order_id,
      company_id: company_id,
      product_id: vendorData.product_id,
      status: status,
      quantity: quantity,
      unit_price: productData && Number.GetFloat(productData.cost > 0 ? productData.cost : productData.mrp),
      amount: Number.GetFloat(amount),
    });
  }
}
}
  } catch (err) {
    console.log(err);
  }
}



const create = async ({ companyId, purchaseOrderId, accountId, loggedInUser }) => {


  let statusDetail;

  if (!purchaseOrderId) { statusDetail = await StatusService.Get(ObjectName.PURCHASE_ORDER, Status.GROUP_DRAFT, companyId); }


  let InprogressStatus;
  if (!purchaseOrderId) { InprogressStatus = await StatusService.Get(ObjectName.PURCHASE_ORDER, Status.GROUP_INPROGRESS, companyId) }

  const purchaseOrderProductStatus = await StatusService.getFirstStatus(ObjectName.PURCHASE_ORDER_PRODUCT, companyId);

  let distributionCenterStoreId = await getSettingValue(Location.DISTRIBUTION_CENTER, companyId);
  const status = await StatusService.getFirstStatusDetail(ObjectName.PURCHASE_ORDER, companyId);

  let vendorProductArray = [];
  let locationIds = [];

  let locationData = await locationModel.findAll({
    where: {
      status: Status.ACTIVE_TEXT,
      company_id: companyId,
      id: {
        [Op.ne]: distributionCenterStoreId,
      },
    },
  });

  for (let i = 0; i < locationData.length; i++) {
    locationIds.push(locationData[i].id);
  }
  let accountWhere = {};

  accountWhere.company_id = companyId;
  accountWhere.type = Account.CATEGORY_VENDOR;

  if (accountId) {
    accountWhere.id = accountId;
  }
  let accountData = await account.findAll({ where: accountWhere, attributes: ["id"] });

  let accountProductData;
  let storeProductData;
  let dcProductData;
  let updateproductData;
  let productData;
  let where={}

  if (accountData && accountData.length > 0) {
    for (let i = 0; i < accountData.length; i++) {

      accountProductData = await AccountProductModel.findAll({
        where: { account_id: accountData[i].id, company_id: companyId },
        attributes: ["account_id", "product_id"],
      });

      if (accountProductData && accountProductData.length > 0) {
        for (let j = 0; j < accountProductData.length; j++) {


          /* ✴---Store Product Data---✴ */
          storeProductData = await storeProduct.findAll({
            attributes: [
              "product_id", 
              [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalQuantity"],
              [Sequelize.fn("SUM", Sequelize.col("min_quantity")), "totalMinQuantity"], 
            ],
            where: {
              store_id: locationIds,
              product_id: accountProductData[j].product_id,
              quantity: {
                [Op.lte]: Sequelize.col("min_quantity"),
              },
              company_id: companyId,
            },
            group: ["product_id"],
          });

          /* ✴---Distribution Product Data---✴ */
          dcProductData = await storeProduct.findAll({
            attributes: [
              "product_id", 
              "quantity",
              "store_id",
            ],
            where: {
              product_id: accountProductData[j].product_id,
              store_id: distributionCenterStoreId,
              company_id: companyId,
            },
          });


          /* ✴---Loop Distribution Product---✴ */
          let dcProductArray = [];
          for (let i = 0; i < dcProductData.length; i++) {
            let { product_id, quantity } = dcProductData[i].dataValues;

            dcProductArray.push({
              product_id: product_id,
              quantity: quantity,
            });
          }


          /* ✴---Loop Store Product---✴ */
          let storeProductArray = [];
          for (let i = 0; i < storeProductData.length; i++) {
            let { product_id, totalQuantity, totalMinQuantity } = storeProductData[i].dataValues;

            storeProductArray.push({
              product_id: product_id,
              quantity: totalMinQuantity - totalQuantity,
            });
          }

         /* ✴---Get Quantity---✴ */
          const getQuantity = (storeProduct, dcProduct) => {
            if (storeProduct.product_id === dcProduct.product_id) {
              storeProduct.quantity -= dcProduct.quantity;
            }
            return storeProduct;
          };
          
          /* ✴---Update quantities in storeProductArray---✴ */
          const updatedStoreProductArray = storeProductArray.map((storeProduct) => {
            const dcProduct = dcProductArray.find((dcProduct) => dcProduct.product_id === storeProduct.product_id);
            return dcProduct ? getQuantity({ ...storeProduct }, dcProduct) : storeProduct;
          });
          updateproductData = updatedStoreProductArray.find(
            (data) => data.product_id == accountProductData[j].product_id
          );

           /* ✴---Update Quantity---✴ */
          if (updateproductData !== undefined) {
            if (updateproductData && updateproductData.quantity == 0) {
              await updateQuantity(
                updateproductData && updateproductData.product_id,
                statusDetail && statusDetail.id,
                updateproductData && updateproductData.quantity,
                purchaseOrderId
              );
            }

            if (InprogressStatus && InprogressStatus.id) {
              where.status = InprogressStatus.id;
            }
            if (purchaseOrderId) {
              where.id = purchaseOrderId;
            }
            productData = await purchaseOrderProductModal.findOne({
              where: { product_id: accountProductData[j].product_id },
              order: [["createdAt", "DESC"]],
              include: [{ model: purchaseOrderModal, as: "purchaseOrder", where: where }],
            });

            if (productData != null) {
              if (updateproductData.quantity > 0) {
                vendorProductArray.push({
                  product_id: updateproductData && updateproductData.product_id,
                  quantity: updateproductData && updateproductData.quantity - productData.quantity,
                  vendor_id: accountProductData[j].account_id,
                });
              }
            } else {
              if (updateproductData.quantity > 0) {
                vendorProductArray.push({
                  product_id: updateproductData && updateproductData.product_id,
                  quantity: updateproductData && updateproductData.quantity,
                  vendor_id: accountProductData[j].account_id,
                });
              }
            }
          }
        }
      }
    }
  }

     /* ✴---Grouping data by vendor_id---✴ */
  const groupedData = vendorProductArray.reduce((result, item) => {
    const { vendor_id, ...data } = item;
    result[vendor_id] = result[vendor_id] || { vendor_id, data: [] };
    result[vendor_id].data.push(data);
    return result;
  }, {});

   /* ✴---Converting the result into an array---✴ */
  const vendorDataArray = Object.values(groupedData);

  let purchase_order_number = 1;
 
   /* ✴---get lastPurchaseOrder---✴ */
  let lastPurchaseOrder = await purchaseOrderModal.findOne({
    order: [["createdAt", "DESC"]],
    where: { company_id: companyId },
  });

  
  /* ✴---get lastPurchaseOrder---✴ */
  purchase_order_number = lastPurchaseOrder && lastPurchaseOrder.purchase_order_number;
  
  /* ✴---validate lastPurchaseOrder exist or no---✴ */
  if (!purchase_order_number) {
    purchase_order_number = 1;
  } else {
    purchase_order_number = purchase_order_number + 1;
  }

  if (vendorDataArray && vendorDataArray.length > 0) {
    for (let i = 0; i < vendorDataArray.length; i++) {
      let where = {};
      if (statusDetail && statusDetail.id) {
        where.status = statusDetail.id;
      }
      if (purchaseOrderId) {
        where.id = purchaseOrderId;
      }
      where.company_id = companyId;

      where.vendor_id = vendorDataArray[i].vendor_id;

      let purchaseOrderExists = await purchaseOrderModal.findOne({
        where: where,
      });

      if (!purchaseOrderExists) {
        let createdData = await purchaseOrderModal.create({
          vendor_id: vendorDataArray[i].vendor_id,
          company_id: companyId,
          date: new Date(),
          status: status && status.id,
          purchase_order_number: purchase_order_number,
          delivery_date: status && status?.due_date ? status?.due_date : new Date(),
          owner_id: await StatusService.GetDefaultOwner(status?.default_owner, loggedInUser),
        });
        if (createdData) {
          purchase_order_number++;
        }

        for (let j = 0; j < vendorDataArray[i].data.length; j++) {
          let params = {
            purchase_order_id: createdData.id,
            status: purchaseOrderProductStatus,
            company_id: companyId,
            vendorData: vendorDataArray[i].data[j],
          };
          await createPurchaseOrderProduct(params);
        }
      } else {
        for (let j = 0; j < vendorDataArray[i].data.length; j++) {
          let purchaseOrderData = await purchaseOrderProductModal.findOne({
            where: { purchase_order_id: purchaseOrderExists.id, product_id: vendorDataArray[i].data[j].product_id },
          });

          if (purchaseOrderData !== null) {
            if (purchaseOrderData.product_id == vendorDataArray[i].data[j].product_id) {
              await purchaseOrderProductModal.update(
                { quantity: vendorDataArray[i].data[j].quantity },
                {
                  where: {
                    product_id: purchaseOrderData.product_id,
                    purchase_order_id: purchaseOrderExists.id,
                  },
                }
              );
            } else {
              let params = {
                vendorData: vendorDataArray[i].data[j],
                purchase_order_id: purchaseOrderExists.id,
                status: purchaseOrderProductStatus,
                company_id: companyId,
              };
              await createPurchaseOrderProduct(params);
            }
          } else {
            let params = {
              vendorData: vendorDataArray[i].data[j],
              purchase_order_id: purchaseOrderExists.id,
              status: purchaseOrderProductStatus,
              company_id: companyId,
            };
            await createPurchaseOrderProduct(params);
          }
        }
      }
    }
  }
};

module.exports = {
  create,
};
