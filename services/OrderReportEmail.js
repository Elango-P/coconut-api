// Email
const mailService = require('./MailService');
const errors = require("restify-errors");

// Service
const DataBaseService = require('../lib/dataBaseService');
const History = require('./HistoryService');
const Request = require('../lib/request');
const schedulerJobCompanyService = require('../routes/scheduler/schedularEndAt');
const { getSettingValue } = require('./SettingService');
const MailConstants = require('../helpers/Setting');
const { BAD_REQUEST } = require('../helpers/Response');
const StoreProduct = require('../helpers/StoreProduct');
const { SchedulerJob } = require('../db').models;
const SchedulerJobService = new DataBaseService(SchedulerJob);

class orderReportEmail extends DataBaseService {
  async sendMail(params, data, callback) {
    
    const{id, companyId, toMail} = params

    try {
      const fromMail = await getSettingValue(MailConstants.FROM_EMAIL, companyId);

      if (!fromMail) {
        throw new errors.NotFoundError('From Mail Not Found');
      }


      // Email Substitution
      const emailSubstitutions = {
        sendData: data.orderData,
        orderDate: data.orderDate,
        total_amount: data.total_amount
      };

      // Email Data
      const emailData = {
        fromEmail: fromMail,
        toEmail: toMail,
        template: 'orderReportEmail',
        subject: `Order Report - ${data.orderDate}`,
        substitutions: emailSubstitutions,
      };

      // Sent Email
      mailService.sendMail(params, emailData, async (err) => {
        if (err) {
          // System Log
          History.create(StoreProduct.EMAIL_SENT_FAILED);
          console.log(err);
        } 
       
        return callback();
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const orderReportEmailService = new orderReportEmail();

module.exports = orderReportEmailService;
