const TicketTestCaseService = require("../../services/TicketTestCaseService");


const del =async (req,res,next)=>{

    await TicketTestCaseService.del(req,res,next)

}

module.exports=del;