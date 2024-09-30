
const orderService = require("../../services/OrderService");

async function updateStatus(req, res, next) {
  try{
    orderService.updateStatus(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = updateStatus;