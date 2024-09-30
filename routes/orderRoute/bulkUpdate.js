
const orderService = require("../../services/OrderService");


async function bulkUpdate(req, res, next) {
  try{
    orderService.bulkUpdate(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = bulkUpdate;