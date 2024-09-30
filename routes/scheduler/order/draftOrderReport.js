const Request = require("../../../lib/request");
const {
  User,
  SchedulerJob,
  Location: LocationModel,
  order,
} = require("../../../db").models;
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const DateTime = require("../../../lib/dateTime");
const {
  getSettingList,
  getValueByObject,
  getSettingValue,
} = require("../../../services/SettingService");
const { FROM_EMAIL } = require("../../../helpers/Setting");
const errors = require("restify-errors");
const Setting = require("../../../helpers/Setting");
const String = require("../../../lib/string");
const { getCompanyDetailById } = require("../../../services/CompanyService");
const Status = require("../../../helpers/Status");
const { Op } = require("sequelize");
const StatusService = require("../../../services/StatusService");
const DraftOrderReportService = require("../../../services/DraftOrderReportService");
const Currency = require("../../../lib/currency");

module.exports = async function (req, res, next) {
  const companyId = Request.GetCompanyId(req);

  let id = req.query.id;
  let settingArray = [];

  let settingList = await getSettingList(companyId);

  for (let i = 0; i < settingList.length; i++) {
    settingArray.push(settingList[i]);
  }

  let companyDetail = await getCompanyDetailById(companyId);

  const schedularData = await SchedulerJob.findOne({
    where: { id: id, company_id: companyId },
  });

  const fromMail = await getValueByObject(FROM_EMAIL, settingArray);

  let userDefaultTimeZone = Request.getTimeZone(req);

  let currentDateTime = DateTime.getDateTimeByUserProfileTimezone(
    new Date(),
    userDefaultTimeZone
  );
  let start_date = DateTime.toGetISOStringWithDayStartTime(currentDateTime);
  let end_date = DateTime.toGetISOStringWithDayEndTime(currentDateTime);

  let toMail = schedularData?.to_email;

  const params = {
    companyId: companyId,
    id: id,
    fromMail,
    toMail,
  };

  res.send(200, {
    message: `${schedularData?.name}  Job Started`,
  });

  History.create(
    `${schedularData?.name} Job Started`,
    req,
    ObjectName.SCHEDULER_JOB,
    id
  );

  res.on("finish", async () => {
    await schedulerJobCompanyService.setStatusStarted(params, (err) => {
      if (err) {
        throw new err();
      }
    });
    try {
      if (companyId) {
        if (!fromMail) {
          throw new errors.NotFoundError("From Mail Not Found");
        }

        if (!schedularData?.to_email) {
          throw new errors.NotFoundError("To Mail Not Found");
        } else {
          toMail = toMail.split(",");
        }

        /* ✴---Get Draft Order Status---✴ */
        let draftOrderStatus = await StatusService.getAllStatusByGroupId(
          ObjectName.ORDER_TYPE,
          Status.GROUP_DRAFT,
          companyId
        );
        let draftOrderStatusIds =
          draftOrderStatus &&
          draftOrderStatus.length > 0 &&
          draftOrderStatus.map((data) => data?.id);

        let locationUserArray = [];

        /* ✴---Get Location List---✴ */
        await LocationModel.findAll({
          where: {
            company_id: companyId,
            status: Status.ACTIVE_TEXT,
          },
          attributes: ["name", "id"],
        }).then(async (locationList) => {
          if (locationList && locationList.length > 0) {
            for (let i = 0; i < locationList.length; i++) {
              let orderCancelOrderList = [];

              /* ✴---Get Order List---✴ */
              await order
                .findAll({
                  where: {
                    store_id: locationList[i]?.id,
                    company_id: companyId,
                    status: {
                      [Op.in]: draftOrderStatusIds,
                    },
                    total_amount: {
                      [Op.or]: [{ [Op.ne]: 0 }, { [Op.ne]: null }],
                    },
                    date: {
                      [Op.and]: {
                        [Op.gte]: DateTime.toGMT(
                          start_date,
                          userDefaultTimeZone
                        ),
                        [Op.lte]: DateTime.toGMT(end_date, userDefaultTimeZone),
                      },
                    },
                  },
                  order:[["createdAt","ASC"]],
                  attributes: ["date", "total_amount", "order_number"],
                  include:[{model:User, as:"ownerDetail"}]
                })
                .then((orderList) => {
                  if (orderList && orderList.length > 0) {
                    for (let k = 0; k < orderList.length; k++) {
                      orderCancelOrderList.push({
                        orderNumber: orderList[k]?.order_number,
                        date: DateTime.getDateTimeByUserProfileTimezone(
                          orderList[k]?.date,
                          userDefaultTimeZone,
                        ),
                        ownerName: String.concatName(orderList[k]?.ownerDetail?.name,orderList[k]?.ownerDetail?.last_name),
                        total_amount: Currency.IndianFormat(
                          orderList[k]?.total_amount
                        ),
                      });
                    }
                  }
                });

              if (orderCancelOrderList && orderCancelOrderList.length > 0) {
                locationUserArray.push({
                  locationName: locationList[i]?.name,
                  orderData: orderCancelOrderList,
                  count: orderCancelOrderList && orderCancelOrderList.length,
                });
              }
            }
          }
        });

        /* ✴---Send Mail---✴ */
        if (toMail.length > 0 && toMail !== null) {
          if (locationUserArray && locationUserArray.length > 0) {
            DraftOrderReportService.sendMail(
              params,
              {
                locationUserArray: locationUserArray,
                companyName: companyDetail && companyDetail?.company_name,
                reportGeneratedAt:
                  DateTime.getCurrentDateTimeByUserProfileTimezone(
                    new Date(),
                    userDefaultTimeZone
                  ),
                schedularName: schedularData && schedularData?.name,
                companyLogo: companyDetail && companyDetail?.company_logo,
              },
              (err) => {
                if (err) {
                  throw new err();
                }
              }
            );
          }
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
      // Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
    }
  });
};
