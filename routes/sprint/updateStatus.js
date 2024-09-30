const { sprintService } = require("../../services/SprintService ");

async function updateStatus(req, res, next) {
    await  sprintService.updateStatus(req,res,next);
  }
  module.exports = updateStatus;
  