const { BillService } = require("../../services/services/billService");

const Permission = require("../../helpers/Permission");

async function updateGstStatus(req, res, next) {

 

  BillService.updateGstStatus(req, res, next);
}

module.exports = updateGstStatus;
