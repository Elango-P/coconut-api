const { SchedulerJob, User, Attendance } = require('../../../db').models;

const ObjectName = require('../../../helpers/ObjectName');
const Setting = require('../../../helpers/Setting');
const Status = require('../../../helpers/Status');
const DateTime = require('../../../lib/dateTime');
// Lib
const Request = require('../../../lib/request');
const { getSettingList, getValueByObject } = require('../../../services/SettingService');
const History = require('../../../services/HistoryService');
const schedulerJobCompanyService = require('../schedularEndAt');

module.exports = async function (req, res) {
  try {
    let company_id = Request.GetCompanyId(req);

    res.send(200, { message: 'Job started' });
    res.on('finish', async () => {
      let settingArray = [];
      let settingList = await getSettingList(Request.GetCompanyId(req));

      for (let i = 0; i < settingList.length; i++) {
        settingArray.push(settingList[i]);
      }

      let id = req.query.id;

      let params = { companyId: company_id, id: id };

      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });

      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      let users = await User.findAll({
        attributes: ['id', 'role', 'session_id'],
        where: { status: Status.ACTIVE, company_id: company_id },
      });

      if (users && users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const userId = users[i].id;
          const role = users[i].role;

          let todayDate = new Date();

          let attendance = await Attendance.findOne({
            attributes: ['login'],
            where: { user_id: userId, date: todayDate, company_id: company_id },
          });

          let auto_logout_hours = await getValueByObject(
            Setting.AUTO_LOGOUT_HOURS,
            settingArray,
            role,
            ObjectName.ROLE
          );

          if (attendance && attendance.login) {
            let checkInTime = new Date(attendance.login);
            checkInTime.setHours(checkInTime.getHours() + parseInt(auto_logout_hours));

            let endTime = checkInTime;

            let date = new Date();

            let currentTime = DateTime.UTCtoLocalTimeAndMmmFormat(date);

            if (currentTime >= DateTime.UTCtoLocalTimeAndMmmFormat(endTime)) {
              await User.update(
                { session_id: null },
                {
                  where: { id: userId, company_id: company_id },
                }
              );
            }

            //Set Scheduler Status Completed
            await schedulerJobCompanyService.setStatusCompleted({ companyId: company_id, id: id }, (err) => {
              if (err) {
                throw new err();
              }
            });

            History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id);
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};
