const { Country, State, SchedulerJob } = require('../../../db').models;

const async = require('async');
const jsonData = require('../../../CountryStateList.json');
const schedulerJobCompanyService = require('../schedularEndAt');
const Request = require('../../../lib/request');
const History = require('../../../services/HistoryService');
const ObjectName = require('../../../helpers/ObjectName');

module.exports = function (req, res, next) {
  try {
    res.send(200, { message: 'Job started' });

    const company_id = Request.GetCompanyId(req);

    res.on('finish', async () => {
      let  id  = req.query.id;

      let params = { companyId: company_id, id: id };

      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });
      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      async.eachSeries(jsonData, async (countryDetail, cb) => {
        const isExist = await Country.findOne({
          where: { country_name: countryDetail.name, company_id: company_id },
        });
        if (!isExist) {
          const countryData = { country_name: countryDetail.name, company_id: company_id };
          await Country.create(countryData).then((res) => {
            async.eachSeries(countryDetail.states, async (states, cb) => {
              try {
                let stateData = {
                  country_id: res.id,
                  name: states.name,
                };
                await State.create(stateData);
                return cb;
              } catch (err) {
                console.log(err);
              }
            });
          });
          return cb;
        }
      });
      //Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id);
    });
  } catch (error) {
    console.log(error);
  }
};
