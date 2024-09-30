const { UserRole,SchedulerJob } = require("../../../db").models;

const ObjectName = require("../../../helpers/ObjectName");
// Lib
const Request = require("../../../lib/request");
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");

module.exports = async function (req, res) {
    try {
        let company_id = Request.GetCompanyId(req);

        res.send(200, { message: "Job started" });
        res.on("finish", async () => {
            let  id  = req.query.id;

      let params = { companyId: company_id, id: id };


            const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });
      
            History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);
            await schedulerJobCompanyService.setStatusStarted(params, err => {
                if (err) {
                    throw new err();
                }
            });
        // Getting sale details
        let roleDetails = await UserRole.findAndCountAll({
            order: [["createdAt", "ASC"]],
        });


        for (let data of roleDetails.rows) {

            let roleData = { ...data.get() };


            let newUserRoleData = { company_id: company_id }
            await UserRole.update(newUserRoleData, { where: { id: roleData.id } })

        }
            	 //Set Scheduler Status Completed
			 await schedulerJobCompanyService.setStatusCompleted(params, err => {
                if (err) {
                    throw new err();
                }
            })
            History.create(`${schedularData?.name} Job Completed`,req, ObjectName.SCHEDULER_JOB, id);

            })
    } catch (err) {
        console.log(err);
    }
};
