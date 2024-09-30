const TicketTestCaseService = require("../../services/TicketTestCaseService");


const update =async (req,res,next)=>{

    await TicketTestCaseService.update(req,res,next)

}

module.exports=update;