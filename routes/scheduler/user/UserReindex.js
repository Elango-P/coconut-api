const ObjectName = require('../../../helpers/ObjectName');
const Status = require('../../../helpers/Status');
const DataBaseService = require('../../../lib/dataBaseService');
const Request = require('../../../lib/request');
const History = require('../../../services/HistoryService');
const UserService = require('../../../services/UserService');
const schedulerJobCompanyService = require('../schedularEndAt');
const { SchedulerJob, User } = require('../../../db').models;
const userService = new DataBaseService(User);

module.exports = async (req, res) => {
  const company_id = Request.GetCompanyId(req);
  let id = req.query.id;
  let currentDate = new Date();

  try {
    // Fetch schedularData
    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });

    if (!schedularData) {
      throw new Error('Scheduler job not found');
    }

    let params = { companyId: company_id, id: id, currentDate: currentDate, schedularData };


    res.send(200, { message: 'Job started' });
    res.on('finish', async () => {
    History.create(`${schedularData.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);
    await schedulerJobCompanyService.setStatusStarted(params, (err) => {
      if (err) {
        throw new err();
      }
    });

    let userList = await userService.find({
      where: { company_id: company_id },
    });

    if (userList && userList.length > 0) {
      for (let i = 0; i < userList.length; i++) {
        const { id: user_id } = userList[i];
        try {
          await UserService.reindex(user_id, company_id);
        } catch (error) {
          console.error(`Error reindexing user ${user_id}:`, error);
        }
      }
    }

    await schedulerJobCompanyService.setStatusCompleted({ companyId: company_id, id: id }, (err) => {
      if (err) {
        throw new err();
      }
    });
    History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id);
    });
  } catch (error) {
    console.error('Error:', error.message);
    // Handle error response accordingly
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
