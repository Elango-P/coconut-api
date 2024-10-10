const { BillService } = require("../../services/services/billService");

const Permission = require("../../helpers/Permission");

async function update(req, res, next) {


  BillService.update(req, res, next);
}

module.exports = update;
