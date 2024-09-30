
const orderService = require("../../services/OrderService");

async function getBySelectedIds(req, res, next) {
  try{
    orderService.getBySelectedIds(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = getBySelectedIds;