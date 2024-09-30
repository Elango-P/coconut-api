
const stockEntryService = require("../../services/StockEntryService");

async function update(req, res) {
  try{
    stockEntryService.update(req, res)
} catch(err){
    console.log(err);
}
};

module.exports = update;