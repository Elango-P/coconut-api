
const AccountTypeService = require("../../services/AccountTypeService");

const del = async (req, res) => {
    AccountTypeService.delete(req, res);
}

module.exports = del;