const TicketTestService = require("../../services/TicketTestService")



const create = async (req,res) => {

   try {
   await TicketTestService.create(req,res)
   } catch (err) {
    console.log(err);
   }
    
    
}
module.exports=create;