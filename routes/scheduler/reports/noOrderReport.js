//Lib
const ObjectName = require('../../../helpers/ObjectName');
const Request = require('../../../lib/request');
const History = require('../../../services/HistoryService');
const noOrderEmailService = require('../../../services/noOrderReportService');
const errors = require('restify-errors');
const schedulerJobCompanyService = require('../schedularEndAt');
const Response = require('../../../helpers/Response');

// Model
const { SchedulerJob } = require('../../../db').models;

module.exports = async function (req, res) {
  let id = req.query.id;

  const companyId = Request.GetCompanyId(req);

  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

  res.send(Response.OK, { message: `${schedularData?.name} Job Started` });

  History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

  let toMail = schedularData?.to_email;

  // params
  const params = {
    companyId: companyId,
    id: id,
    toMail: toMail,
    name: schedularData?.name,
  };

    res.on('finish', async () => {

  try {

      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      // validate to mail
      if (!schedularData?.to_email) {
        throw new errors.NotFoundError('To Mail Not Found');
      } else {
        toMail = toMail.split(',');
      }

      if (companyId && toMail.length > 0 && toMail !== null) {
        await noOrderEmailService.sendMail(params, (err) => {
          if (err) {
            throw new err();
          }
        });
      }
    } catch (err) {
      console.log(err);
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
    }
    });
  
};
