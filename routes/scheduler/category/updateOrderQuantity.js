const Request = require("../../../lib/request");
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const CategoryService = require("../../../services/CategoryService");
const Response = require("../../../helpers/Response");
const { SchedulerJob } = require("../../../db").models;

module.exports = async function (req, res, next) {
  try {
    let companyId = Request.GetCompanyId(req);
    let id = req.query.id;
    let params = { companyId: companyId, id: id };

    const schedularData = await SchedulerJob.findOne({
      where: { id: id, company_id: companyId },
    });

    res.send(Response.OK, { message: `${schedularData?.name} Job Started` });

    res.on("finish", async () => {
      History.create(
        `${schedularData?.name} Job Started`,
        req,
        ObjectName.SCHEDULER_JOB,
        id
      );

      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      await CategoryService.updateOrderQuantity(params);

      //Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      History.create(
        `${schedularData?.name} Job Completed`,
        req,
        ObjectName.SCHEDULER_JOB,
        id
      );
    });
  } catch (err) {
    console.log(err);
  }
};
