const ObjectName = require("../../../helpers/ObjectName");
const { FROM_EMAIL } = require("../../../helpers/Setting");
const Request = require("../../../lib/request");
const { getSettingValue } = require("../../../services/SettingService");
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const { SchedulerJob, order,  User, Location: LocationModel } = require("../../../db").models;
const errors = require("restify-errors");
const { Op } = require("sequelize");
const DateTime = require("../../../lib/dateTime");
const CancelledOrderNotification = require("../../../services/cancelledOrderNotificationService");
const Currency = require("../../../lib/currency");
const String = require("../../../lib/string");
const Setting = require("../../../helpers/Setting");
const StatusService = require("../../../services/StatusService");
const Status = require("../../../helpers/Status");
const { getCompanyDetailById } = require("../../../services/CompanyService");

module.exports = async (req, res, next) => {


  const companyId = Request.GetCompanyId(req);
  let id = req.query.id;
  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });
  const fromMail = await getSettingValue(FROM_EMAIL, companyId);
  let toMail = schedularData?.to_email;

  let userDefaultTimeZone = Request.getTimeZone(req);
  let currentDateTime = DateTime.getDateTimeByUserProfileTimezone(new Date(),userDefaultTimeZone)
  let start_date = DateTime.toGetISOStringWithDayStartTime(currentDateTime)
  let end_date = DateTime.toGetISOStringWithDayEndTime(currentDateTime)
  let companyDetail = await getCompanyDetailById(companyId);
  const params = {
    companyId: companyId,
    id: id,
    fromMail,
    toMail,
  };
  
  try {
    res.send(200, { message: `${schedularData?.name}  Job Started` });
    History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

    res.on("finish", async () => {
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
    });
    if (companyId) {
      if (!fromMail) {
        if (!fromMail) {
          throw new errors.NotFoundError("From Mail Not Found");
        }
      }
      if (!schedularData?.to_email) {
        throw new errors.NotFoundError("To Mail Not Found");
      } else {
        toMail = toMail.split(",");
      }
    }

        /* ✴---Get Draft Order Status---✴ */
        let cancelledOrderStatus = await StatusService.getAllStatusByGroupId(ObjectName.ORDER_TYPE,Status.GROUP_CANCELLED,companyId)
        let cancelledOrderStatusIds = cancelledOrderStatus && cancelledOrderStatus.length > 0 && cancelledOrderStatus.map((data)=> data?.id)
        /* ✴---Get User List---✴ */
        let userList  = await User.findAll({
            where:{
                company_id: companyId,
                status: Status.ACTIVE
            },
            attributes:['id','name','last_name']
        })
        let locationUserArray=[]
        
        /* ✴---Get Location List---✴ */
        await LocationModel.findAll({
            where: {
              company_id: companyId,
              status: Status.ACTIVE_TEXT,
            },
            attributes: ["name","id"],
          }).then(async (locationList) => {
            if(locationList && locationList.length>0){
                for (let i = 0; i < locationList.length; i++) {
                    
                    if(userList && userList.length > 0){
                        for (let j = 0; j < userList.length; j++) {
                            let orderCancelOrderList=[]
                            
                            /* ✴---Get Order List---✴ */
                             await order.findAll({
                                where: {
                                  store_id: locationList[i]?.id,
                                  company_id: companyId,
                                  owner: userList[j]?.id,
                                  status:{
                                    [Op.in]: cancelledOrderStatusIds
                                  },
                                  date: {
                                    [Op.and]: {
                                      [Op.gte]: DateTime.toGMT(start_date,userDefaultTimeZone),
                                      [Op.lte]: DateTime.toGMT(end_date,userDefaultTimeZone),
                                    },
                                  },
                                },
                                attributes:['date','total_amount','order_number']
                              }).then((orderList)=>{
                                if(orderList && orderList.length>0){
                                  for (let k = 0; k < orderList.length; k++) {
                                      orderCancelOrderList.push({
                                        orderNumber: orderList[k]?.order_number,
                                          date: DateTime.getDateTimeByUserProfileTimezone(orderList[k]?.date,userDefaultTimeZone),
                                          total_amount: Currency.IndianFormat(orderList[k]?.total_amount)
                                      })
                                  }
                                }
                              })
                              if(orderCancelOrderList && orderCancelOrderList.length > 0){
                              locationUserArray.push({
                                locationName: locationList[i]?.name,
                                userName: String.concatName(userList[j]?.name,userList[j]?.last_name),
                                orderData: orderCancelOrderList,
                                count: orderCancelOrderList && orderCancelOrderList.length
                              })
                            }
                        }
                    }
                }
            }
          })

    if (toMail.length > 0 && toMail !== null) {
      if(locationUserArray && locationUserArray.length >0){
        CancelledOrderNotification.sendMail(
          params,
          {
            locationUserArray: locationUserArray,
            companyName: companyDetail && companyDetail?.company_name,
            reportGeneratedAt: DateTime.getCurrentDateTimeByUserProfileTimezone(new Date(), userDefaultTimeZone),
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
      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id);
    }
  } catch (error) {
    History.create(`${schedularData?.name} error - ${error.message}`, req, ObjectName.SCHEDULER_JOB, id);
    await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
      if (err) {
        throw new err();
      }
    });
    console.log(error);
  }
};
