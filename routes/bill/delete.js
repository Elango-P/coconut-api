const { BillService } = require("../../services/services/billService");

async function del(req, res, next) {
  try{
    BillService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;