const { BillService } = require("../../services/services/billService");

const Permission = require("../../helpers/Permission");

async function updateStatus(req, res, next) {

  

  BillService.updateStatus(req, res, next);
}

module.exports = updateStatus;
