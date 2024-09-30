const TicketTestService = require("../../services/TicketTestService")



const update = async (req,res) => {

   try {
   await TicketTestService.update(req,res)
   } catch (err) {
    console.log(err);
   }
    
    
}
module.exports=update;