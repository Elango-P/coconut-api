const Request = require("../../lib/request");

// Models
const { StockEntryProduct, StockEntry, status: statusModel } = require("../../db").models;
const ObjectName = require("../../helpers/ObjectName");
const History = require("../../services/HistoryService");

const locationProductService = require("../../services/locationProductService");
const Number = require("../../lib/Number");
const StockEntryService = require("../../services/StockEntryService");
const StatusService = require("../../services/StatusService");
const Status = require("../../helpers/Status");
const DateTime = require("../../lib/dateTime");
const { getSettingValue } = require("../../services/SettingService");
const Setting = require("../../helpers/Setting");

const create = async (req, res) => {
  //get company Id from request
  try {
    let body = req.body;

    //get company Id from request
    const companyId = Request.GetCompanyId(req);
    let ownerId = Request.getUserId(req)

    try {
      let ids = [];
      let storeIds = [];

      let productDetails = [];

      let stockEntryProductDetail;
      let initialStockEntryStatus = await StatusService.getFirstStatusDetail(ObjectName.STOCK_ENTRY_PRODUCT, companyId);
      let stockEntryDetail = await StockEntryService.getStockEntryById(body.stockEntryId,null,null,companyId)
      if (body.productId) {
        let storeProductDetail = await locationProductService.getStoreProductByStoreAndProductId(
          body.storeId,
          req.body.productId
        );

        let statusValue;

        if (body.quantity == storeProductDetail.quantity) {
          statusValue = await getSettingValue(Setting.MACHED_STATUS, companyId);
        }
        if (body.quantity !== storeProductDetail.quantity) {
          statusValue = await getSettingValue(Setting.NOT_MACHED_STATUS, companyId);
        }
        let where = {};
        if (statusValue) {
          where.id = statusValue;
        } else {
          where.id = initialStockEntryStatus?.id;
        }
        where.company_id = companyId;
        let statusDetail = await statusModel.findOne({ where: where });

        let createData = {
          product_id: req.body.productId,
          stock_entry_id: body.stockEntryId,
          company_id: companyId,
          quantity: body.quantity,
          store_id: body.storeId,
          created_by: req.user.id,
          status: statusValue ? statusValue : initialStockEntryStatus?.id,
          shift_id: stockEntryDetail && stockEntryDetail?.shift_id,
          owner_id: ownerId
        };

        if (storeProductDetail) {
          createData.system_quantity = Number.Get(storeProductDetail.quantity);
        }

        stockEntryProductDetail = await StockEntryProduct.create(createData);

        if (body.quantity && stockEntryProductDetail) {
          const { createdAt } = stockEntryProductDetail;

          if (
            statusDetail &&
            statusDetail?.update_quantity == Status.UPDATE_QUANTITY_ENABLED &&
            statusDetail.location_product_last_stock_entry_date_update ==
              Status.LOCATION_PRODUCT_LAST_STOCK_ENTRY_DATE_UPDATE_ENABLED
          ) {
            //update quantity
            await locationProductService.updateByProductId(body.storeId, body.productId, companyId, {
              quantity: body.quantity,
              last_stock_entry_date: createdAt,
            });

            History.create(
              `Quantity Updated From ${storeProductDetail.quantity} To ${body.quantity}`,
              req,
              ObjectName.STORE_PRODUCT,
              storeProductDetail.id
            );
          } else {
          }
          if (statusDetail && statusDetail?.update_quantity == Status.UPDATE_QUANTITY_ENABLED) {
            //update quantity
            await locationProductService.updateByProductId(body.storeId, body.productId, companyId, {
              quantity: body.quantity,
            });

            History.create(
              `Quantity Updated From ${storeProductDetail.quantity} To ${body.quantity}`,
              req,
              ObjectName.STORE_PRODUCT,
              storeProductDetail.id
            );
          }

          if (
            statusDetail &&
            statusDetail.location_product_last_stock_entry_date_update ==
              Status.LOCATION_PRODUCT_LAST_STOCK_ENTRY_DATE_UPDATE_ENABLED
          ) {
            //update quantity
            await locationProductService.updateByProductId(body.storeId, body.productId, companyId, {
              last_stock_entry_date: createdAt,
            });

            History.create(
              `Last Stock Entry Date Updated To ${DateTime.Format(createdAt)} `,
              req,
              ObjectName.STORE_PRODUCT,
              storeProductDetail.id
            );
          }
        }
      } else if (body.productIds) {
        ids = body.productIds.split(",");

        ids.forEach(async (id) => {
          const createData = {
            product_id: id,
            stock_entry_id: body.stockEntryId,
            company_id: companyId,
            store_id: body.storeId,
            created_by: req.user.id,
            status: initialStockEntryStatus?.id,
            shift_id: stockEntryDetail && stockEntryDetail?.shift_id,
            owner_id: ownerId
          };
          productDetails = await StockEntryProduct.create(createData);
          History.create(
            "Stock Product Entry Added",
            req,
            ObjectName.STOCK_ENTRY,
            productDetails.dataValues.stock_entry_id
          );
        });
      } else {
        ids = body.selectedIds.split(",");
        storeIds = body.storeIds.split(",");

        let initialStockEntryStatus = await StatusService.getFirstStatusDetail(ObjectName.STOCK_ENTRY, companyId);
        let initialStockEntryProductStatus = await StatusService.getFirstStatusDetail(
          ObjectName.STOCK_ENTRY_PRODUCT,
          companyId
        );
        let draftStatus = await StatusService.Get(ObjectName.STOCK_ENTRY, Status.GROUP_DRAFT, companyId);

        let lastStockEntry = await StockEntry.findOne({
          order: [["createdAt", "DESC"]],
          where: { company_id: companyId },
        });

        let stock_entry_number = 1;

        if (lastStockEntry && lastStockEntry.stock_entry_number) {
          stock_entry_number = lastStockEntry.stock_entry_number + 1;
        }

        for (const storeId of storeIds) {
          let stockentryDetail = await StockEntry.findOne({
            where: { company_id: companyId, store_id: storeId, date: new Date(), status: draftStatus?.id },
          });
          const createData = {
            company_id: companyId,
            store_id: storeId,
            status: initialStockEntryStatus?.id,
            date: DateTime.UTCtoLocalTime(new Date()),
            stock_entry_number: stock_entry_number,
          };
          stock_entry_number++;

          if (!stockentryDetail) {
            const productDetails = await StockEntry.create(createData);
            for (const id of ids) {
              const createProductData = {
                product_id: id,
                stock_entry_id: productDetails.id,
                company_id: companyId,
                store_id: storeId,
                status: initialStockEntryProductStatus?.id,
                shift_id: stockEntryDetail && stockEntryDetail?.shift_id,
                owner_id: ownerId
              };
              await StockEntryProduct.create(createProductData);
            }
            History.create("Stock Entry Added", req, ObjectName.STOCK_ENTRY, productDetails.id);
          } else {
            for (const id of ids) {
              const createProductData = {
                product_id: id,
                stock_entry_id: stockentryDetail.id,
                company_id: companyId,
                store_id: storeId,
                status: initialStockEntryProductStatus?.id,
                shift_id: stockEntryDetail && stockEntryDetail?.shift_id,
                owner_id: ownerId
              };
              await StockEntryProduct.create(createProductData);
            }

            History.create("Stock Entry Added", req, ObjectName.STOCK_ENTRY, productDetails.id);
          }
        }
      }
      res.json(200, {
        message: "Stock Product Entry Added",
        stockEntryProductDetail: stockEntryProductDetail,
      });
      res.on("finish", async () => {
        //create system log for product updation
        History.create("Stock Product Entry Added", req, ObjectName.STOCK_ENTRY, productDetails.id);
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

module.exports = create;
