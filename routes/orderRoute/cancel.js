const OrderService = require("../../services/OrderService");


const cancel =async (req,res,next)=>{

    await OrderService.cancel(req,res,next)

}

module.exports=cancel