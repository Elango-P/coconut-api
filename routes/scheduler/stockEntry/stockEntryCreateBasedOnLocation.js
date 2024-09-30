const Request = require('../../../lib/request');
const {
  storeProduct,
  SchedulerJob,
  StockEntry,
  status: statusModal,
  StockEntryProduct,
  productIndex,
  Attendance,
} = require('../../../db').models;
const StoreService = require('../../../services/LocationService');
const ObjectName = require('../../../helpers/ObjectName');
const History = require('../../../services/HistoryService');
const schedulerJobCompanyService = require('../schedularEndAt');
const DataBaseService = require('../../../lib/dataBaseService');
const DateTime = require('../../../lib/dateTime');
const { Op, Sequelize } = require('sequelize');
const StockEntryStatus = require('../../../helpers/StockEntry');
const storeProductService = new DataBaseService(storeProduct);
const StockEntryService = new DataBaseService(StockEntry);
const statusService = new DataBaseService(statusModal);
const StockEntryProductService = new DataBaseService(StockEntryProduct);

const getNextStockEntryNumber = async (company_id) => {
  try {
    let stock_entry_number;
    //get lastStockEntry
    let lastStockEntry = await StockEntryService.findOne({
      order: [['createdAt', 'DESC']],
      where: { company_id },
    });

    //get lastStockEntry
    stock_entry_number = lastStockEntry && lastStockEntry.stock_entry_number;
    //validate lastStockEntry exist or no
    if (!stock_entry_number) {
      stock_entry_number = 1;
    } else {
      stock_entry_number = stock_entry_number + 1;
    }

    return stock_entry_number;
  } catch (err) {
    console.log(err);
  }
};

module.exports = function (req, res) {
  try {
    const company_id = Request.GetCompanyId(req);

    res.send(200, { message: 'Job Started' });

    res.on('finish', async () => {
      let id = req.query.id;

      let params = { companyId: company_id, id: id };


      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });

      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      const status = await statusService.findOne({
        where: {
          company_id: company_id,
          name: StockEntryStatus.STATUS_DRAFT_TEXT,
          object_name: ObjectName.STOCK_ENTRY,
        },
      });

      if (company_id) {
        const storeList = await StoreService.search(company_id);

        try {
          if (storeList && storeList.length > 0) {

            const storeIds = storeList.map(store => store.id);

            let attendaceList = await Attendance.findAll({
              where: {
                company_id: company_id,
                date: {
                  [Op.and]: {
                    [Op.gte]: DateTime.formatDate(new Date(), DateTime.getVariable().shortMonthDate),
                    [Op.lte]: DateTime.toGetISOStringWithDayEndTime(new Date()),
                  },
                }
              }
            })

            let stockEntryData;

            let createStockProduct;

            let attendanceData;

            let storeProductData;

            let query;

            for (let i = 0; i < storeIds.length; i++) {

              storeProductData = null;

              query = {
                where: { company_id: company_id, store_id: storeIds[i] },
                limit: 100,
                order: [
                  [Sequelize.literal('"last_stock_entry_date" ASC NULLS FIRST')],
                  ["last_stock_entry_date", "ASC"],
                  [{ model: productIndex, as: 'productIndex' }, 'category_name', 'ASC']
                ],
                include: [
                  {
                    required: true,
                    duplicating: false,
                    model: productIndex,
                    as: 'productIndex',
                  },
                ],
              };

              storeProductData = await storeProductService.find(query);

              if (attendaceList && attendaceList.length > 0) {
                attendanceData = attendaceList.find((data) => data.store_id == storeIds[i]);
              }

              stockEntryData = await StockEntryService.create({
                company_id: company_id,
                status: status?.id,
                store_id: storeIds[i],
                date: DateTime.UTCtoLocalTime(new Date()),
                stock_entry_number: await getNextStockEntryNumber(company_id),
                owner_id: attendanceData ? attendanceData.user_id : null,
              })

              if (stockEntryData && storeProductData && storeProductData.length > 0) {

                for (let j = 0; j < storeProductData.length; j++) {

                  createStockProduct = {
                    product_id: storeProductData[j].product_id,
                    stock_entry_id: stockEntryData?.id,
                    company_id: company_id,
                    store_id: stockEntryData?.store_id,
                  };

                  await StockEntryProductService.create(createStockProduct);
                }
              }
            }

          }
        } catch (err) {
          console.log(err);
        }
      }

      //   Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id);
    });
  } catch (err) {
    console.log(err);
  }
};
