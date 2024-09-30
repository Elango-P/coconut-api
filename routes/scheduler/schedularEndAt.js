//Service
const DataBaseService = require('../../lib/dataBaseService');
const Request = require('../../lib/request');
const SCHEDULER_JOB = require('../../helpers/SchedulerJobStatus');
const { SchedulerJob } = require('../../db').models;

class SchedulerJobCompanyService extends DataBaseService {
    async update(req, data, callback) {
        try {
            if (!req) {
                return callback("Job Id is required");
            }
            //Get Job Id By base URL
            const jobId = await this.getSchedulerJobIdByBaseUrl(req);

            let companyId = Request.GetCompanyId(req);


            //Validate
            const isExist = await SchedulerJob.findOne({
                where: { id: jobId, company_id: companyId },
            });
            //Data
            let updatedData = {};
            if (data) {
                //Update Execution Status
                if (data.executionStatus) {
                    if (data.executionStatus == SCHEDULER_JOB.COMPLETED) {
                        updatedData.completed_at = new Date();
                    } else {
                        updatedData.started_at = new Date();
                    }
                }
                //Update Status
                if (data.status) {
                    updatedData.status = data.status;
                }

                //Validate
                if (!isExist) {
                    updatedData.company_id = companyId;
                    await SchedulerJob.create(updatedData);
                } else
                    await SchedulerJob.update(updatedData, {
                        where: {
                            id: jobId,
                            company_id: companyId,
                        },
                    });
            }

            return callback(null);
        } catch (error) { }
    }

  async setStatusCompleted(params, callback) {
    try {
      if (!params.id) {
        return callback('Job Id is required');
      }
      //Get Job Id By base URL
      const jobId = params.id;
      const companyId = params.companyId


      //Validate
      const isExist = await SchedulerJob.findOne({
        where: { id: jobId, company_id: companyId },
      });

      //Data
      let updatedData = {};

      //Update Execution Status
      updatedData.completed_at = new Date();

      //Update Status
      updatedData.status = SCHEDULER_JOB.STATUS_COMPLETED_VALUE;

      //Validate
      if (!isExist) {
        updatedData.company_id = companyId;
        await SchedulerJob.create(updatedData);
      } else {
        await SchedulerJob.update(updatedData, {
          where: {
            id: jobId,
            company_id: companyId,
          },
        });
      }
      return callback;
    } catch (error) {
      console.log(error);
    }
  }

  async setStatusStarted(params, callback) {


    try {
      if (!params.id) {
        return callback('Job Id is required');
      }
      //Get Job Id By base URL
      const jobId = params.id;
      const companyId = params.companyId


      //Validate
      const isExist = await SchedulerJob.findOne({
        where: { id: jobId, company_id: companyId },
      });


      //Data
      let updatedData = {};

      //Update Execution Status
      updatedData.started_at = new Date();
      updatedData.completed_at =null;

      //Update Status
      updatedData.status = SCHEDULER_JOB.STATUS_COMPLETED_VALUE;


      //Validate
      if (!isExist) {
        updatedData.company_id = companyId;
        await SchedulerJob.create(updatedData);
      } else {
        await SchedulerJob.update(updatedData, {
          where: {
            id: jobId,
            company_id: companyId,
          },
        });
      }

      return callback;
    } catch (error) {

      console.log(error);
    }
  }

  //Get Job Id By Base Url
  async getSchedulerJobIdByBaseUrl(req) {
    let baseUrl = req && req.url;

    let companyId = Request.GetCompanyId(req);

    let jobId;

    const schedulerDetail = await SchedulerJob.findOne({
      where: { api_url: baseUrl, company_id: companyId },
    });

    if (schedulerDetail) {
      jobId = schedulerDetail && schedulerDetail.id;
    }

    return jobId;
  }
}
const schedulerJobCompanyService = new SchedulerJobCompanyService();

module.exports = schedulerJobCompanyService;
