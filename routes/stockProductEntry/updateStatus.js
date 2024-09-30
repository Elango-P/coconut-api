const stockEntryProductService = require("../../services/StockEntryProductService");

const updateStatus = async (req, res) => {
  await stockEntryProductService.updateStatus(req, res);
};

module.exports = updateStatus;
