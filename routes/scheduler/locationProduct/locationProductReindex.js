const Request = require('../../../lib/request');
const { SchedulerJob } = require('../../../db').models;
const schedulerJobCompanyService = require('../schedularEndAt');
const History = require('../../../services/HistoryService');
const ObjectName = require('../../../helpers/ObjectName');
const locationProductService = require('../../../services/locationProductService');

module.exports = async (req, res) => {
  try {
    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
      return res.send(200, { message: 'Company Id is Required' });
    }

    let schedulerId = req && req.query && req.query.id;
    let params = { companyId: companyId, id: schedulerId };


    const schedularData = await SchedulerJob.findOne({ where: { id: schedulerId, company_id: companyId } });

    History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, schedulerId);

    await schedulerJobCompanyService.setStatusStarted(params, (err) => {
      if (err) {
        throw new err();
      }
    });

    // send response
    res.send(200, { message: 'Location Product Reindex Job Started' });

    // systemLog
    res.on('finish', async () => {
      
      await locationProductService.Reindex(companyId);

      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, schedulerId);
    });
  } catch (err) {
    console.log(err);
  }
};
