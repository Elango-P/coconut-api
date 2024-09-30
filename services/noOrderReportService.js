const Request = require("../lib/request");
const StoreService = require("./LocationService");
const { order, Setting, Media, Location: LocationModel } = require("../db").models;
const DataBaseService = require("../lib/dataBaseService");
const DateTime = require("../lib/dateTime");
const { Op } = require("sequelize");
const History = require("./HistoryService");
const ObjectName = require("../helpers/ObjectName");
const schedulerJobCompanyService = require("../routes/scheduler/schedularEndAt");
const moment = require("moment");
const { getSettingValue } = require("./SettingService");
const orderService = new DataBaseService(order);
const errors = require("restify-errors");
const mailService = require("./MailService");
const MailConstants = require("../helpers/Setting");
const { getMediaURL } = require("./MediaService");
const { ALLOW_SALE } = require("../helpers/Sales");
const Location = require("../helpers/Location");
const locationService = new DataBaseService(LocationModel);

async function hasNoOrdersWithinOneHour(storeId, companyId) {
  try {
    const currentDate = new Date();

    let endTime = DateTime.GetGmtDate(currentDate);

    const startTime = DateTime.getOnehourAgo(currentDate);

    const givenTimess = DateTime.GetGmtDate(startTime);

    let where = {};
    if (storeId) {
      where.store_id = storeId;
    }
    where.company_id = companyId;
    where.createdAt = {
      [Op.and]: {
        [Op.gte]: givenTimess,
        [Op.lt]: endTime,
      },
    };

    const orderData = await orderService.find({ where: where });

    return orderData.length === 0;
  }catch(err){
    console.log(err);
  }
}

class noOrderEmail extends DataBaseService {
  async sendMail(params, callBack) {
    try {
      let { companyId, toMail, name ,timeZone} = params;

      const fromMail = await getSettingValue(MailConstants.FROM_EMAIL, companyId);

      if (!fromMail) {
        throw new errors.NotFoundError("From Mail Not Found");
      }

      // systemLog
      if (companyId) {
        // get store lsit
        const storeList = await locationService.find({
          where: {
            company_id: companyId,
            status: Location.STATUS_ACTIVE,
            allow_sale: ALLOW_SALE,

          }
        })

        let sendData = new Array();
        let currentDate = new Date().toISOString();
        let headerColor = [];
        let headerTextColor = [];
        let filteredData = new Array();


        let mediaData = await Media.findOne({
          where: { company_id: companyId, object_name: ObjectName.PORTAL_LOGO_URL, object_id: companyId },
          order: [["createdAt", "DESC"]],
        });

        let mediaUrl = await getMediaURL(mediaData?.id, companyId);

        const getSettingDetails = await Setting.findAndCountAll({
          where: {
            company_id: companyId,
          },
        });

        for (let i in getSettingDetails.rows) {
          let value = getSettingDetails.rows[i];
          if (value.name === "portal_header_color") {
            headerColor.push(value?.value);
          }
          if (value.name === "portal_header_text_color") {
            headerTextColor.push(value?.value);
          }
        }

        let start_date = DateTime.toGetISOStringWithDayStartTime(new Date())
        let end_date = DateTime.toGetISOStringWithDayEndTime(new Date())

        let localDate = DateTime.GetGmtDate(new Date());

        let orderDifferenceMinutes;
        let orderDate;

        let orderData = {}
        let hasNoOrders;
        let data = {}
        let dataObj = {}


        // validate store list length
        if (storeList && storeList.length > 0) {
          for (let i = 0; i < storeList.length; i++) {
            hasNoOrders = await hasNoOrdersWithinOneHour(storeList[i].id, companyId);

            orderData = await orderService.findOne({
              where: {
                company_id: companyId,
                createdAt: {
                  [Op.and]: {
                    [Op.gte]: DateTime.toGMT(start_date,timeZone),
                    [Op.lte]: DateTime.toGMT(end_date,timeZone),
                  },
                },
                store_id: storeList[i].id
              },
              order: [["createdAt", "DESC"]],

            })

            orderDate = DateTime.GetGmtDate(orderData?.createdAt)

            orderDifferenceMinutes = DateTime.Difference(orderDate, localDate);


            if (hasNoOrders && orderDifferenceMinutes > 0) {
              data = {
                locationName: storeList[i].name,
                differenceHours: orderDifferenceMinutes,
              };
              sendData.push(data);
            }
          }
        }

        sendData.sort((a, b) => b.differenceHours - a.differenceHours);

        for (let i = 0; i < sendData.length; i++) {
          dataObj = {
            locationName: sendData[i].locationName,
            differenceHours: DateTime.HoursAndMinutes(sendData[i].differenceHours)
          }
          filteredData.push(dataObj)
        }

        if (params.summary == true) {
          return callBack(filteredData);
        }
        // Email Substitution
        const emailSubstitutions = {
          sendData: filteredData,
          orderDate: DateTime.Format(currentDate),
          schedularName: name,
          logoImage: mediaUrl,
          headerColor: headerColor,
          headerTextColor: headerTextColor,
        };

        // Email Data
        const emailData = {
          fromEmail: fromMail,
          toEmail: toMail,
          template: "noOrderReport",
          subject: "No Order Report Email ",
          substitutions: emailSubstitutions,
        };
        if (sendData.length > 0 && toMail.length > 0 && toMail !== null) {
          return mailService.sendMail(params, emailData, async (err) => {
            if (err) {
              console.log(err);
            }
            return callBack();
          });
        } else {
          await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
            if (err) {
              throw new err();
            }
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
const noOrderEmailService = new noOrderEmail();

module.exports = noOrderEmailService;
