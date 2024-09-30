// Models
const { StockEntryProduct, productIndex} = require("../../db").models;

// Services
const History = require("../../services/HistoryService");
const locationProductService = require("../../services/locationProductService");
const StatusService = require("../../services/StatusService");
const { getSettingValue } = require("../../services/SettingService");

// Helpers
const ObjectName = require("../../helpers/ObjectName");
const Status = require("../../helpers/Status");
const Setting = require("../../helpers/Setting");

// Lib
const Number = require("../../lib/Number");
const DateTime = require("../../lib/dateTime");
const Request = require("../../lib/request");

const update = async (req, res) => {
  let { id } = req.params;

  try {
    //get stock product entry Id

    //get quantity
    const { quantity , product_id } = req.body;

    let updateData = new Object();

    //get company Id from request
    const companyId = Request.GetCompanyId(req);

    let ownerId = Request.getUserId(req)

    //validate stock product entry Id exist or not
    if (!id) {
      return res.json(400, { message: "stock Product Entry Id is required" });
    }

    //validate stock entry product exist or not
    let storeEntryProductDetail = await StockEntryProduct.findOne({
      where: { company_id: companyId, id: id },
    });

    // get product details
    let productDetails = await productIndex.findOne({
      where: { product_id : product_id}
    })

    let productName = productDetails && productDetails?.product_display_name;

    //validate stock entry product exist or not
    if (!storeEntryProductDetail) {
      return res.json(400, { message: "Stock Product Entry Not Found" });
    }

    let storeProductDetail = await locationProductService.getStoreProductByStoreAndProductId(
      storeEntryProductDetail.store_id,
      storeEntryProductDetail.product_id
    );


    if (storeProductDetail) {
      updateData.system_quantity = Number.Get(storeProductDetail.quantity);
    }

    updateData.quantity = quantity;

    let statusValue;

    if (quantity == storeProductDetail.quantity) {
      statusValue = await getSettingValue(Setting.MACHED_STATUS, companyId);
    }

    if (quantity !== storeProductDetail.quantity) {
      statusValue = await getSettingValue(Setting.NOT_MACHED_STATUS, companyId);
    }

    if(statusValue){

      updateData.status = statusValue;
    }

    if(ownerId){
      updateData.owner_id = ownerId
    }

    let statusId = statusValue ? statusValue : storeEntryProductDetail.status;


    await StockEntryProduct.update(updateData, { where: { company_id: companyId, id: id } });

    if (!isNaN(quantity) && storeEntryProductDetail) {

      let statusDetail = await StatusService.getData(statusId, companyId);

      let storeEntryProductDetail = await StockEntryProduct.findOne({
        where: { company_id: companyId, id: id },
      });


      if (
        statusDetail &&
        statusDetail?.update_quantity == Status.UPDATE_QUANTITY_ENABLED &&
        statusDetail.location_product_last_stock_entry_date_update ==
          Status.LOCATION_PRODUCT_LAST_STOCK_ENTRY_DATE_UPDATE_ENABLED
      ) {
        //update quantity
        await locationProductService.updateByProductId(
          storeEntryProductDetail.store_id,
          storeEntryProductDetail.product_id,
          companyId,
          {
            quantity: quantity,
            last_stock_entry_date: storeEntryProductDetail?.createdAt,
          }
        );

        History.create(
          `Quantity Updated From ${storeProductDetail.quantity} To ${storeEntryProductDetail.quantity}`,
          req,
          ObjectName.STORE_PRODUCT,
          storeProductDetail.id
        );
      } else {
      }
      if (
        statusDetail &&
        statusDetail?.update_quantity == Status.UPDATE_QUANTITY_ENABLED &&
        statusDetail.location_product_last_stock_entry_date_update !=
          Status.LOCATION_PRODUCT_LAST_STOCK_ENTRY_DATE_UPDATE_ENABLED
      ) {
        //update quantity
        await locationProductService.updateByProductId(
          storeEntryProductDetail.store_id,
          storeEntryProductDetail.product_id,
          companyId,
          {
            quantity: quantity,
          }
        );

        History.create(
          `Quantity Updated From ${storeProductDetail.quantity} To ${storeEntryProductDetail.quantity}`,
          req,
          ObjectName.STORE_PRODUCT,
          storeProductDetail.id
        );
      }

      if (
        statusDetail &&
        statusDetail.location_product_last_stock_entry_date_update ==
          Status.LOCATION_PRODUCT_LAST_STOCK_ENTRY_DATE_UPDATE_ENABLED &&
        statusDetail?.update_quantity != Status.UPDATE_QUANTITY_ENABLED
      ) {
        //update quantity
        await locationProductService.updateByProductId(
          storeEntryProductDetail.store_id,
          storeEntryProductDetail.product_id,
          companyId,
          {
            last_stock_entry_date: storeEntryProductDetail?.createdAt,
          }
        );

        History.create(
          `Last Stock Entry Date Updated To ${DateTime.Format(storeEntryProductDetail?.createdAt)} `,
          req,
          ObjectName.STORE_PRODUCT,
          storeProductDetail.id
        );
      }
    }

    if(Number.Get(storeEntryProductDetail.quantity) !== Number.Get(quantity)) {
      History.create(
        `${productName} - Quantity updated To ${quantity}`,
        req,
        ObjectName.STOCK_ENTRY,
        storeEntryProductDetail.stock_entry_id
      );
    }

    res.json(200, { message: "Stock Product Entry Updated" });

    res.on("finish", async () => {
      //create system log for product updation
      History.create("Stock Product Entry Updated", req, ObjectName.STOCK_ENTRY, id);
    });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

module.exports = update;