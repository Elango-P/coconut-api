const PageService = require("../../services/PageService");

async function statusUpdate(req, res) {
  await PageService.statusUpdate(req,res)
}

module.exports = statusUpdate;