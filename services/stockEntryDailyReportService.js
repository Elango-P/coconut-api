const Request = require('../lib/request');
const StoreService = require('./LocationService');
const { StockEntry, StockEntryProduct, User, Attendance } = require('../db').models;
const DataBaseService = require('../lib/dataBaseService');
const DateTime = require('../lib/dateTime');
const { Op } = require('sequelize');
const History = require('./HistoryService');
const ObjectName = require('../helpers/ObjectName');
const schedulerJobCompanyService = require('../routes/scheduler/schedularEndAt');
const moment = require('moment');
const { getSettingValue } = require('./SettingService');
const StockEntryService = new DataBaseService(StockEntry);
const StockEntryProductService = new DataBaseService(StockEntryProduct);
const ProductService = require('./ProductService');

const errors = require('restify-errors');
const mailService = require('./MailService');
const StoreProduct = require('../helpers/StoreProduct');
const MailConstants = require('../helpers/Setting');
const String = require('../lib/string');

class stockEntryDailyReport extends DataBaseService {
  async sendMail(params, callBack) {
    try {
      let { companyId, toMail, name } = params;

      const fromMail = await getSettingValue(MailConstants.FROM_EMAIL, companyId);

      if (!fromMail) {
        throw new errors.NotFoundError('From Mail Not Found');
      }

      // systemLog
      if (companyId) {
        // get store lsit
        const storeList = await StoreService.search(companyId);

        let currentDate = DateTime.getSQlFormattedDate(new Date());
        let timeZone = await getSettingValue(MailConstants.USER_DEFAULT_TIME_ZONE, companyId);
        let start_date = DateTime.toGetISOStringWithDayStartTime(currentDate)
        let end_date = DateTime.toGetISOStringWithDayEndTime(currentDate)

        let where = new Object();

        where.createdAt = {
          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date,timeZone),
            [Op.lte]: DateTime.toGMT(end_date,timeZone),
          },
        };
        where.company_id = companyId;
        // validate store list length
        let sendData = new Array();

        let updateData = [];
        let stockData = {};
        let stockEntryProductData = [];

        let attendanceWhere = new Object();

        attendanceWhere.date = new Date();
        attendanceWhere.login = { [Op.ne]: null };
        attendanceWhere.company_id = companyId;

        if (storeList && storeList.length > 0) {
          for (let index = 0; index < storeList.length; index++) {
            attendanceWhere.store_id = storeList[index].id;

            let query = {
              where: attendanceWhere,
              include: [
                {
                  required: false,
                  model: User,
                  as: 'user',
                },
              ],
            };

            let attendanceData = await Attendance.findAll(query);

            for (let j = 0; j < attendanceData.length; j++) {
              let userData = attendanceData[j].user;

              where.owner_id = attendanceData[j].user_id;
              where.store_id = attendanceData[j].store_id;

              stockEntryProductData = await StockEntryProduct.findAndCountAll({
                where: where,
              });

              let NotMatchedCount = 0;
              for (const product of stockEntryProductData.rows) {
                if (product.dataValues.quantity !== product.dataValues.system_quantity) {
                  NotMatchedCount++;
                }
              }

              stockData = {
                userName: String.concatName(userData.name, userData.last_name),
                locationName: storeList[index].name,
                count: stockEntryProductData.count,
                NotMatchedCount: NotMatchedCount,
              };
              updateData.push(stockData);
            }
          }
        }

        // Email Substitution
        const emailSubstitutions = {
          sendData: updateData,
          orderDate: DateTime.Format(currentDate),
          SchedularName: name,
        };

        // Email Data
        const emailData = {
          fromEmail: fromMail,
          toEmail: toMail,
          template: 'stockEntryDailyReport',
          subject: 'Stock Entry Daily Report ',
          substitutions: emailSubstitutions,
        };

        return mailService.sendMail(params, emailData, async (err) => {
          if (err) {
            // System Log
            console.log(err);
            // System Log
          }
          return callBack();
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
const stockEntryDailyReportService = new stockEntryDailyReport();

module.exports = stockEntryDailyReportService;
