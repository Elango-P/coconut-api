
const stockEntryService = require("../../services/StockEntryService");

async function del(req, res) {
  try{
    stockEntryService.del(req, res)
} catch(err){
    console.log(err);
}
};

module.exports = del;