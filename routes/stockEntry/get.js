
const stockEntryService = require("../../services/StockEntryService");

async function get(req, res) {
  try{
    stockEntryService.get(req, res)
} catch(err){
    console.log(err);
}
};

module.exports = get;