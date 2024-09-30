const mailService = require("./MailService");
const errors = require("restify-errors");

// Service
const DataBaseService = require("../lib/dataBaseService");
const History = require("./HistoryService");
const Request = require("../lib/request");
const schedulerJobCompanyService = require("../routes/scheduler/schedularEndAt");
const { getSettingValue } = require("./SettingService");
const MailConstants = require("../helpers/Setting");
const { BAD_REQUEST } = require("../helpers/Response");
const StoreProduct = require("../helpers/StoreProduct");
const Status = require("../helpers/Status");
const { Op } = require("sequelize");
const { SchedulerJob, Attendance: attendanceModel, Location } = require("../db").models;
const SchedulerJobService = new DataBaseService(SchedulerJob);

class StoreNoCheckInNotificationService extends DataBaseService {
  async sendMail(params, data, callback) {
    let { companyId, toMail, currentDate, shift_id, type } = params;

    try {
      const fromMail = await getSettingValue(MailConstants.FROM_EMAIL, companyId);

      if (!fromMail) {
        throw new errors.NotFoundError("From Mail Not Found");
      }

      let attendanceId = [];
      let locationName = [];
      let where = new Object();
      let attendanceWhere = {}
      if(shift_id){
        attendanceWhere.shift_id = shift_id
      }

      where.status = Status.ACTIVE_TEXT;
      where.company_id = companyId;
      if(type){
        where.type = type
      }
      let Stores = await Location.findAll({
        where,
        order: [["name", "ASC"]],
      });
      for (let i = 0; i < Stores.length; i++) {
        const { id } = Stores[i];
        let Attendance = await attendanceModel.findOne({
          where: {
            company_id: companyId,
            date: currentDate,
            store_id: id,
            ...attendanceWhere
          },
        });
        if (Attendance !== null) {
          attendanceId.push(Attendance?.store_id);
        }
      }
      let storeWhere={}
      if(type){
        storeWhere.type = type
      }
      let sortDetails = await Location.findAll({
        where: {
          id: {
            [Op.notIn]: attendanceId,
          },
          status: Status.ACTIVE_TEXT,
          company_id: companyId,
          ...storeWhere
        },
        order: [["name", "ASC"]],
      });

      for (let i = 0; i < sortDetails.length; i++) {
        const { name } = sortDetails[i];
        locationName.push({ name });
      }
      if(params.summary == true){
        return callback(locationName)
      }

      // Email Substitution
      const emailSubstitutions = {
        sendData: locationName,
        orderDate: data.orderDate,
        logoImage: data.logoImage,
        headerColor: data.headerColor,
        headerTextColor: data.headerTextColor,
      };

      // Email Data
      const emailData = {
        fromEmail: fromMail,
        toEmail: toMail,
        template: "storeNotificationMail",
        subject: "Location: No Check-In Notification",
        substitutions: emailSubstitutions,
      };

      // Sent Email
      mailService.sendMail(params, emailData, async (err) => {
        if (err) {
          // System Log
          History.create(StoreProduct.EMAIL_SENT_FAILED);
        }

        return callback();
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const storeNoCheckInNotificationService = new StoreNoCheckInNotificationService();

module.exports = storeNoCheckInNotificationService;
