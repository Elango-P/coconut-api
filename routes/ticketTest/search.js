const TicketTestService = require("../../services/TicketTestService")



const search = async (req,res) => {
   try {
   await TicketTestService.search(req,res)
   } catch (err) {
    console.log(err);
   }
}
module.exports=search;