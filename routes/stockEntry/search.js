
const stockEntryService = require("../../services/StockEntryService");

async function search(req, res) {
  try{
    stockEntryService.search(req, res)
} catch(err){
    console.log(err);
}
};

module.exports = search;