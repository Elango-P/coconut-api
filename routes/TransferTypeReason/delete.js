
const ReasonService = require("../../services/TransferTypeReasonService");

const del = async (req, res) => {
    ReasonService.delete(req, res)
}

module.exports = del;