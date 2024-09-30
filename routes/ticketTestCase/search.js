const TicketTestCaseService = require("../../services/TicketTestCaseService");


const search =async (req,res,next)=>{

    await TicketTestCaseService.search(req,res,next)

}

module.exports=search;