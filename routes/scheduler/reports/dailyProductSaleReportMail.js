const Request = require('../../../lib/request');
const StoreService = require('../../../services/LocationService');
const { orderProduct: orderProductModal, productIndex,SchedulerJob } = require('../../../db').models;
const DataBaseService = require('../../../lib/dataBaseService');
const DateTime = require('../../../lib/dateTime');
const { Op } = require('sequelize');
const orderReportEmailService = require('../../../services/OrderReportEmail');
const Currency = require('../../../lib/currency');
const dailyProductSaleService = require('../../../services/dailyProductSaleReportService');
const History = require('../../../services/HistoryService');
const schedulerJobCompanyService = require('../schedularEndAt');
const ObjectName = require('../../../helpers/ObjectName');
const errors = require('restify-errors');
const { USER_DEFAULT_TIME_ZONE } = require("../../../helpers/Setting");
const { getSettingValue } = require("../../../services/SettingService");

const orderService = new DataBaseService(orderProductModal);
const productIndexService = new DataBaseService(productIndex);

module.exports = async (req, res) => {
    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
      companyId = req.query.companyId;
    }

    let  id = req.query.id;

    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });
    // send response
    History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);

    res.send(200, { message: `${schedularData?.name} Job Started` });


    let toMail = schedularData?.to_email;

    let params = { companyId: companyId, id: id , name:schedularData?.name , toMail:toMail};

    // systemLog
    res.on('finish', async () => {
  try {

      if (companyId) {

        await schedulerJobCompanyService.setStatusStarted(params, (err) => {
          if (err) {
            throw new err();
          }
        });
        // get store lsit
        const productList = await productIndexService.find({where:{company_id: companyId,}});

        let sendData = new Array();
        let timeZone = Request.getTimeZone(req);
        let start_date = DateTime.toGetISOStringWithDayStartTime(new Date())
        let end_date = DateTime.toGetISOStringWithDayEndTime(new Date())


        // validate store list length
        if (productList && productList.length > 0) {
          for (let i = 0; i < productList.length; i++) {
            const { product_display_name, product_id,featured_media_url } = productList[i];
            let totalQuantity = 0;

            const orderData = await orderService.find({
              where: {
                product_id: product_id,
                company_id: companyId,
                order_date: {
                  [Op.and]: {
                    [Op.gte]: DateTime.toGMT(start_date,timeZone),
                    [Op.lte]: DateTime.toGMT(end_date,timeZone),
                  },
                },
              },
            });

            for (let k = 0; k < orderData.length; k++) {
              const { quantity } = orderData[k];
              totalQuantity += Number(quantity);
            }

            let data = {
              productName: product_display_name,
              image:featured_media_url,
              totalQuantity: totalQuantity,
            };
            sendData.push(data);
          }

          sendData.sort((a, b) => {
            const quantityA = parseFloat(a.totalQuantity);
            const quantityB = parseFloat(b.totalQuantity);
            return quantityB - quantityA;
          });



      if (!schedularData?.to_email) {
        throw new errors.NotFoundError('To Mail Not Found');
      } else {
        toMail = toMail.split(',');
      }

      if(toMail.length>0 && toMail !== null, sendData.lenght>0){
          dailyProductSaleService.sendMail(
            params,
            { 
              orderData: sendData.slice(0,50),
              orderDate: DateTime.getDateTimeByUserProfileTimezone(currentDate,timeZone),
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
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
    }
    });
 
};
