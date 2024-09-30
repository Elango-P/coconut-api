const Request = require('../../../lib/request');
const { SchedulerJob } = require('../../../db').models;

const ObjectName = require('../../../helpers/ObjectName');
const History = require('../../../services/HistoryService');
const schedulerJobCompanyService = require('../schedularEndAt');
const purchaseOrderCreateService = require('../../../services/purchaseOrderCreateService');

module.exports = async function (req, res) {
  try {
    const company_id = Request.GetCompanyId(req);

    let id = req.query.id;

    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });
    res.send(200, { message: 'Job Started' });

    res.on('finish', async () => {

      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

      let params = { companyId: company_id, id: id, name: schedularData?.name,loggedInUser : req.user.id };

      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      if (company_id) {
        await purchaseOrderCreateService.create(params);
      }

      //   Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id);
    });
  } catch (err) {
    console.log(err);
  }
};
