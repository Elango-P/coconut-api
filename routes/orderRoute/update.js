
const orderService = require("../../services/OrderService");

const Permission = require("../../helpers/Permission");
const Request = require("../../lib/request");

async function update(req, res, next) {
  try{

   
    orderService.update(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = update;