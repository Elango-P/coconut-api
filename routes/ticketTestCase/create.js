const TicketTestCaseService = require("../../services/TicketTestCaseService");


const create =async (req,res,next)=>{

    await TicketTestCaseService.create(req,res,next)

}

module.exports=create;