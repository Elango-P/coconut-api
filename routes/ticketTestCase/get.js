const TicketTestCaseService = require("../../services/TicketTestCaseService");

const get = async (req, res, next) => {
  await TicketTestCaseService.get(req, res, next);
};

module.exports = get;
