const stockEntryProductService = require("../../services/StockEntryProductService");


const search = async (req, res) => {

    await stockEntryProductService.search(req,res);
};

module.exports = search;
