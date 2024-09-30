const LeadService = require("../../services/LeadService");


async function statusUpdate(req, res, next) {
  LeadService.statusUpdate(req, res, next);
}

module.exports = statusUpdate;