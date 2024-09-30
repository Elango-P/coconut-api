const Request = require('../../../lib/request');
const { Attendance: attendanceModel, SchedulerJob, User, Company } = require('../../../db').models;
const History = require('../../../services/HistoryService');
const schedulerJobCompanyService = require('../schedularEndAt');
const ObjectName = require('../../../helpers/ObjectName');
const DateTime = require('../../../lib/dateTime');
const { ACTIVE_STATUS } = require('../../../helpers/SchedulerJobStatus');
const errors = require('restify-errors');
const String = require('../../../lib/string');
const { getSettingValue } = require('../../../services/SettingService');
const { FROM_EMAIL } = require('../../../helpers/Setting');
const mailService = require('../../../services/MailService');
const { EMAIL_SENT_FAILED } = require('../../../helpers/SalesSettlementReport');
const attendance = require('../../../services/notifications/attendance');


module.exports = async function (req, res) {
  const companyId = Request.GetCompanyId(req);

  // send response

  let id = req.query.id;

  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });
  let toMail = schedularData?.to_email;
  // params
  const params = {
    companyId: companyId,
    id: id,
    name: schedularData?.name,
    toMail: toMail,
  };
  res.send(200, { message: 'User: No Check-In Report Job Started' });


  res.on('finish', async () => {

    try {

      if (companyId) {


        History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

        await schedulerJobCompanyService.setStatusStarted(params, (err) => {
          if (err) {
            throw new err();
          }
        });

        let where = new Object()
        where.status = ACTIVE_STATUS
        where.company_id = companyId

        let UserList = await User.findAll({
          where,
          order: [['name', 'ASC']],
        });

        let currentDate = new Date().toISOString().slice(0, 10);
        let attendanceData = [];
        let messageObject = {}
        let attedanceData = []

        let companyData = await Company.findOne({ where: { id: companyId } })

        for (let i = 0; i < UserList.length; i++) {
          attedanceData = await attendanceModel.findOne({
            where: {
              company_id: companyId,
              date: currentDate,
              user_id: UserList[i].id,
            },
          });
          if (!attedanceData) {
            messageObject = {
              userName: String.concatName(UserList[i].name, UserList[i].last_name),
              companyName: companyData?.company_name,
              date: DateTime.Format(currentDate),
              Message: "No-CheckIn",
              companyId: companyId
            }

            //send slack notification
            await attendance.sendNoChekinActivityReport(messageObject);
            attendanceData.push(messageObject);

          }
        }



        // Email Substitution
        const emailSubstitutions = {
          sendData: attendanceData,
          date: DateTime.Format(currentDate),
        };

        const fromMail = await getSettingValue(FROM_EMAIL, companyId);

        // Validate from mail
        if (!fromMail) {
          throw new errors.NotFoundError('From Mail Not Found');
        }

        // validate to mail
        if (!schedularData?.to_email) {
          throw new errors.NotFoundError('To Mail Not Found');
        } else {
          toMail = toMail.split(',');
        }

        // Email Data
        const emailData = {
          fromEmail: fromMail,
          toEmail: toMail,
          template: 'noCheckinActivityReport',
          subject: 'User: No Check-In Report',
          substitutions: emailSubstitutions,
        };

        

        if (attendanceData.length > 0 && toMail.length > 0 && toMail !== null) {

          // Sent Email
          mailService.sendMail(params, emailData, async (err) => {
            if (err) {
              // System Log
              History.create(EMAIL_SENT_FAILED);
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
      console.log(err);
    }
  });

};
