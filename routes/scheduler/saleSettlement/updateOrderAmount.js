const { SchedulerJob } = require('../../../db').models;

const ObjectName = require('../../../helpers/ObjectName');
// Lib
const Request = require('../../../lib/request');
const History = require('../../../services/HistoryService');
const schedulerJobCompanyService = require('../schedularEndAt');

const SaleSettlementService = require('../../../services/SaleSettlementService');

module.exports = async function (req, res) {
  let id = req.query.id;
  try {
    let company_id = Request.GetCompanyId(req);

    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });

    let params = { companyId: company_id, id: id };

    res.send(200, { message: 'Job started' });

    res.on('finish', async () => {
      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      await SaleSettlementService.updateOrderAmount(company_id);

      //Set Scheduler Status Completed
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
