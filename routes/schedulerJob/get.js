const errors = require("restify-errors");

// Models
const { SchedulerJob } = require("../../db").models;
const schedularjob = require("./processList");
const { USER_DEFAULT_TIME_ZONE } = require('../../helpers/Setting');
const { getSettingValue } = require("../../services/SettingService");
const Request = require("../../lib/request");

async function get(req, res, next) {
  const id = req.params.id;
  const companyId = Request.GetCompanyId(req);

  let timeZone = await getSettingValue(USER_DEFAULT_TIME_ZONE, companyId);
  
  SchedulerJob.findOne({
    where: { id, company_id: companyId },
  })
    // eslint-disable-next-line new-cap
    .then((scheduler) => res.json(schedularjob(scheduler, timeZone, false)));
}
module.exports = get;
