// Models
const { SchedulerJob } = require("../../../db").models;

const schedulerJob = require("../../../helpers/SchedulerJob");
const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");

async function createDefaultRecord(req, res, next) {
  try {
    //get company ID from requ user
    const companyId = Request.GetCompanyId(req);

    res.json(200, {
      message: "Default Scheduler Job Started",
    });

    res.on("finish", async () => {
      let id = req.query.id
      let params = { companyId: companyId, id: id };

      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

      History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);
      await schedulerJobCompanyService.setStatusStarted(params, async err => {

        if (err) {
            throw new err();
        }
      })
      //loop the default scheduler jobs
      for (let i = 0; i < schedulerJob.length; i++) {
        //create schedyler job Object
        let createData = {
          job_name: schedulerJob[i].name,
          name: schedulerJob[i].name,
          api_url: schedulerJob[i].api_url,
          status: 1,
          interval: 60,
          company_id: companyId
        }

         //get scheduler job exit or not
        let isSchedulerJobExist = await SchedulerJob.findOne({
          where: { api_url: schedulerJob[i].api_url, company_id: companyId }
        })
         //validate scheduler job exist or not
        if (!isSchedulerJobExist) {
          await SchedulerJob.create(createData);
        }
      }
         	 //Set Scheduler Status Completed
			 await schedulerJobCompanyService.setStatusCompleted(params, err => {
        if (err) {
            throw new err();
        }
    })
    History.create(`${schedularData?.name} Job Completed`,req, ObjectName.SCHEDULER_JOB, id);

  });

  } catch (err) {
    console.log(err);
    res.json(400, {
      message: err.message,
    });
  }
}

module.exports = createDefaultRecord;
