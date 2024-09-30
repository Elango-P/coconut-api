const rewardReportService = require("../../services/rewardReportService")



const Report =async (req,res,next)=>{

    await rewardReportService.report(req,res,next)

}

module.exports=Report