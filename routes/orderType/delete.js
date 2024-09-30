const OrderTypeService = require("../../services/OrderTypeService");


const del = async (req, res) => {
    OrderTypeService.delete(req, res);
}

module.exports = del;