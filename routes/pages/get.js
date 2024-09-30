
const PageService = require("../../services/PageService");

// Pages Get route
async function get(req, res) {
   await PageService.get(req,res)
};

module.exports = get;