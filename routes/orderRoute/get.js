
const orderService = require("../../services/OrderService");

async function get(req, res, next) {
  try{
    orderService.get(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = get;