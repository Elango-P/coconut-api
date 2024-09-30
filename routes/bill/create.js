
const { BillService } = require("../../services/services/billService")

async function create(req, res, next) {
  BillService.create(req, res, next);
}

module.exports = create;