
const TransferTypeService = require("../../services/TransferTypeService");

const del = async (req, res) => {
    TransferTypeService.delete(req, res);
}

module.exports = del;