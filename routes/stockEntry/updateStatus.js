
const stockEntryService = require("../../services/StockEntryService");

async function updateStatus(req, res) {
  try{
    stockEntryService.updateStatus(req, res)
} catch(err){
    console.log(err);
}
};
module.exports = updateStatus;