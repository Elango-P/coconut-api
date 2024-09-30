const PageService = require("../../services/PageService");



// Page search route
async function search(req, res) {
  await PageService.search(req,res)
}
module.exports = search;