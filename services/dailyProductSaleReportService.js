// Email
const mailService = require('./MailService');

// Service
const DataBaseService = require('../lib/dataBaseService');
const History = require('./HistoryService');
const Request = require('../lib/request');
const schedulerJobCompanyService = require('../routes/scheduler/schedularEndAt');
const { getSettingValue } = require('./SettingService');
const MailConstants = require('../helpers/Setting');
const { BAD_REQUEST } = require('../helpers/Response');
const StoreProduct = require('../helpers/StoreProduct');
const ObjectName = require('../helpers/ObjectName');
const { SchedulerJob } = require('../db').models;

const SchedulerJobService = new DataBaseService(SchedulerJob);

class dailyProductSale extends DataBaseService {
  async sendMail(params, data, callback) {
    const { companyId, id, toMail } = params;

    try {
      const fromMail = await getSettingValue(MailConstants.FROM_EMAIL, companyId);

      if (!fromMail) {
        throw new errors.NotFoundError('From Mail Not Found');
      }

      // Email Substitution
      const emailSubstitutions = {
        sendData: data.orderData,
        orderDate: data.orderDate,
      };

      // Email Data
      const emailData = {
        fromEmail: fromMail,
        toEmail: toMail,
        template: 'productSaleReportMail',
        subject: 'Daily Product Wise Report Email',
        substitutions: emailSubstitutions,
      };

      // Sent Email
      mailService.sendMail(params, emailData, async (err) => {
        if (err) {
          // System Log
          console.log(err);
        }
        // Set Scheduler Status Completed
        await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
          if (err) {
            throw new err();
          }
        });
        return callback();
      });
    } catch (error) {
      console.log(err);
      throw error;
    }
  }
}

const dailyProductSaleService = new dailyProductSale();

module.exports = dailyProductSaleService;
