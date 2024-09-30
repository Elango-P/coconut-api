const TicketTestService = require("../../services/TicketTestService")



const del = async (req,res) => {

   try {
   await TicketTestService.delete(req,res)
   } catch (err) {
    console.log(err);
   }
    
    
}
module.exports=del;