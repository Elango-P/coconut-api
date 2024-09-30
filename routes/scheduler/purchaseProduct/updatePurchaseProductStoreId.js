const { PurchaseProduct,  Purchase, SchedulerJob } = require("../../../db").models;

// Lib
const Request = require("../../../lib/request");
const DataBaseService = require("../../../lib/dataBaseService");
const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");
const purchaseProductService = new DataBaseService(PurchaseProduct);
const purchaseService = new DataBaseService(Purchase);


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
        let purchaseData = await purchaseService.findAndCount({ where: { company_id } });
        for (let data of purchaseData.rows) {
            let value = { ...data.get() };
            let id = value.id
            let updateData = {
                store_id: value.store_id,
                vendor_id: value.vendor_id
            }
            await purchaseProductService.update(updateData, { where: { purchase_id: id, company_id: company_id }, });
        }
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