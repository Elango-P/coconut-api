const orderService = require("../../services/OrderService");

const Permission = require("../../helpers/Permission");

async function updateDeliveryStatus(req, res, next) {
  try{


   

    orderService.updateDeliveryStatus(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = updateDeliveryStatus;