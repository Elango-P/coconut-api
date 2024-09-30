const { SchedulerJob, StockEntryProduct: StockEntryProductModel } = require('../../../db').models;

const { getSettingValue } = require('../../../services/SettingService');


// Lib
const Request = require('../../../lib/request');

const schedulerJobCompanyService = require('../schedularEndAt');
const History = require('../../../services/HistoryService');
const ObjectName = require('../../../helpers/ObjectName');
const DataBaseService = require('../../../lib/dataBaseService');
const SchedulerJobService = new DataBaseService(SchedulerJob);
const StatusService = require('../../../services/StatusService');
const Response = require('../../../helpers/Response');
const Status = require('../../../helpers/Status');
const Setting = require('../../../helpers/Setting');
const locationProductService = require('../../../services/locationProductService');
const DateTime = require("../../../lib/dateTime");
module.exports = async function (req, res) {
  let params = { companyId: Request.GetCompanyId(req), id: Request.GetId(req) };

  const schedularData = await SchedulerJobService.findOne({
    where: { id: Request.GetId(req), company_id: Request.GetCompanyId(req) },
  });

  res.send(Response.OK, { message: `Job Started` });

  res.on('finish', async () => {
    try {
      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, Request.GetId(req));
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      const companyId = Request.GetCompanyId(req);

      let statusDetail = await StatusService.Get(ObjectName.STOCK_ENTRY_PRODUCT, Status.GROUP_APPROVED, companyId);
      let statusValue = await getSettingValue(Setting.NOT_MACHED_STATUS, companyId);

      let stockEntryProductData = await StockEntryProductModel.findAll({
        where: { status: statusValue, company_id: companyId },
      });

      if (stockEntryProductData && stockEntryProductData.length > 0) {
        for (let i = 0; i < stockEntryProductData.length; i++) {

            // Update Status
            await StockEntryProductModel.update({status:statusDetail?.id}, { where: { company_id: companyId, id: stockEntryProductData[i].id } });

          let storeProductDetail = await locationProductService.getStoreProductByStoreAndProductId(
            stockEntryProductData[i].store_id,
            stockEntryProductData[i].product_id
          );

        
          if (
            statusDetail &&
            statusDetail?.update_quantity == Status.UPDATE_QUANTITY_ENABLED &&
            statusDetail.location_product_last_stock_entry_date_update ==
              Status.LOCATION_PRODUCT_LAST_STOCK_ENTRY_DATE_UPDATE_ENABLED
          ) {
            //update quantity
            await locationProductService.updateByProductId(
              stockEntryProductData[i].store_id,
              stockEntryProductData[i].product_id,
              companyId,
              {
                quantity: stockEntryProductData[i].quantity,
                last_stock_entry_date: stockEntryProductData[i]?.createdAt,
              }
            );

            History.create(
              `Quantity Updated From ${storeProductDetail.quantity} To ${stockEntryProductData[i].quantity}`,
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
              stockEntryProductData[i].store_id,
              stockEntryProductData[i].product_id,
              companyId,
              {
                quantity: stockEntryProductData[i].quantity,
              }
            );

            History.create(
              `Quantity Updated From ${storeProductDetail.quantity} To ${stockEntryProductData[i].quantity}`,
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
            //update LOCATION_PRODUCT_LAST_STOCK_ENTRY_DATE_UPDATE_ENABLED
            await locationProductService.updateByProductId(
              stockEntryProductData[i].store_id,
              stockEntryProductData[i].product_id,
              companyId,
              {
                last_stock_entry_date: stockEntryProductData[i]?.createdAt,
              }
            );

            History.create(
              `Last Stock Entry Date Updated To ${DateTime.Format(stockEntryProductData[i]?.createdAt)} `,
              req,
              ObjectName.STORE_PRODUCT,
              storeProductDetail.id
            );
          }
        }
      }
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, Request.GetId(req));
    } catch (err) {
      console.log(err);

      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
   
    }
  });
};
