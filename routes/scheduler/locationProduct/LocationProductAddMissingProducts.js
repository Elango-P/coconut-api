const ObjectName = require("../../../helpers/ObjectName");
const Request = require("../../../lib/request");
const LocationProductAddMissingProducts = require("../../../services/LocationProductAddMissingProducts");
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const { SchedulerJob } = require("../../../db").models;

module.exports = async (req, res) => {
  const company_id = Request.GetCompanyId(req);

  let id = req.query.id;

  let currentDate = new Date();

  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });

  let params = { companyId: company_id, id: id, currentDate: currentDate ,schedularData};

  History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

  res.send(200, { message: "Job started" });

  // systemLog
  res.on("finish", async () => {
    
    try {
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
        await LocationProductAddMissingProducts.update(company_id);
        History.create("Location Product: Add Missing Products Completed", req);
        await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
          if (err) {
            throw new err();
          }
        });
    } catch (err) {
      console.log(err);
    }
  });

};