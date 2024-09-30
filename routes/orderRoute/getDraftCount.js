const orderService = require("../../services/OrderService");

 async function getDraftCount(req, res, next){
 
       try {
    
        orderService.getDraftCount(req, res, next);
    
      } catch (err) {
        console.log(err);
      }
};
module.exports = getDraftCount;
