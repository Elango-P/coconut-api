
const orderService = require("../../services/OrderService");

async function del(req, res, next) {
  try{
    orderService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;