const Request = require('../../../lib/request');
const StoreService = require('../../../services/LocationService');
const { orderProduct: orderProductModal, SchedulerJob } = require('../../../db').models;
const DataBaseService = require('../../../lib/dataBaseService');
const DateTime = require('../../../lib/dateTime');
const { Op } = require('sequelize');
const orderReportEmailService = require('../../../services/OrderReportEmail');
const Currency = require('../../../lib/currency');
const History = require('../../../services/HistoryService');
const ObjectName = require('../../../helpers/ObjectName');
const schedulerJobCompanyService = require('../schedularEndAt');
const errors = require("restify-errors");
const { getSettingValue } = require("../../../services/SettingService");
const Setting = require("../../../helpers/Setting");

const orderService = new DataBaseService(orderProductModal);

module.exports = async (req, res) => {
    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
      companyId = req.query.companyId;
    }
     let  id  = req.query.id;
     let userDefaultTimeZone = Request.getTimeZone(req);

      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

      let toMail = schedularData?.to_email

      let params = { companyId: companyId, id: id, toMail:toMail };

      History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);
    // send response
    res.send(200, { message: `${schedularData?.name}  Job Started` });

    // systemLog
    res.on('finish', async () => {
      try {
  
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      if (companyId) {
        // get store lsit
        const storeList = await StoreService.search(companyId);

        let sendData = new Array();
        let start_date = DateTime.toGetISOStringWithDayStartTime(new Date())
        let end_date = DateTime.toGetISOStringWithDayEndTime(new Date())

        // validate store list length
        if (storeList && storeList.length > 0) {
          for (let i = 0; i < storeList.length; i++) {
            const { name, id } = storeList[i];
            let totalAmount = 0;

            const orderData = await orderService.find({
              where: {
                store_id: id,
                company_id: companyId,
                order_date: {
                  [Op.and]: {
                    [Op.gte]: DateTime.toGMT(start_date,userDefaultTimeZone),
                    [Op.lte]: DateTime.toGMT(end_date,userDefaultTimeZone),
                  },
                },
              },
            });

            for (let k = 0; k < orderData.length; k++) {
              const { price } = orderData[k];
              totalAmount += Number(price);
            }

            let data = {
              locationName: name,
              totalAmount: Currency.IndianFormat(totalAmount),
              total_amount_without_currency:totalAmount
            };
            sendData.push(data);
          }

          sendData.sort((a, b) => a.locationName.localeCompare(b.locationName));
          const totalAmount = sendData.reduce((sum, item) => sum + item.total_amount_without_currency, 0);
      if (!schedularData?.to_email) {
        throw new errors.NotFoundError('To Mail Not Found');
      }
      else {
        toMail = toMail.split(",");
    } 

    if(sendData.length>0 && toMail.length>0 && toMail !== null){

          orderReportEmailService.sendMail(
            params,
            {
              orderData: sendData,
              orderDate: DateTime.getCurrentDateTimeByUserProfileTimezone(new Date(),userDefaultTimeZone),
              total_amount: Currency.IndianFormat(totalAmount)
            },
            () => {}
          );
    }else{
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
    }
        }
      }
    } catch (err) {
      console.log(err);
      // Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
    }
    });
 
};
