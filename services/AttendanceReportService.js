const mailService = require('./MailService');


// Service
const DataBaseService = require('../lib/dataBaseService');
const History = require('./HistoryService');
const schedulerJobCompanyService = require('../routes/scheduler/schedularEndAt');
const StoreProduct = require('../helpers/StoreProduct');



class attendanceDailyReportNotificationService extends DataBaseService {
  async sendMail(params, data, callback) {
    const { companyId, id, fromMail, toMail } = params;
    
    try {
     
      // Email Substitution
      const emailSubstitutions = {
        ...data,
        attendanceDate: data.attendanceDate,
      };

      // Email Data
      const emailData = {
        fromEmail: fromMail,
        toEmail: toMail,
        template: 'attendanceReport',
        subject: `Attendance Report - ${data.reportGeneratedAt}`,
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

const AttendanceDailyReportNotificationService = new attendanceDailyReportNotificationService();

module.exports = AttendanceDailyReportNotificationService;
