const mailService = require('./MailService');
const DataBaseService = require('../lib/dataBaseService');
const History = require('./HistoryService');
const StoreProduct = require('../helpers/StoreProduct');



class locationCashMismatchReportService extends DataBaseService {
  async sendMail(params, data, callback) {
    const { fromMail, toMail } = params;
    
    try {
     
      // Email Substitution
      const emailSubstitutions = {
        ...data,
      };

      // Email Data
      const emailData = {
        fromEmail: fromMail,
        toEmail: toMail,
        template: 'locationCashMismatchReport',
        subject: `Cash In Location Mismatch Report - ${data.reportGeneratedAt}`,
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

const LocationCashMismatchReportService = new locationCashMismatchReportService();

module.exports = LocationCashMismatchReportService;
