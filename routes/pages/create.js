

// Module dependencies
const PageService = require("../../services/PageService");

// Create Pages route
async function create (req, res, next) {
  
await PageService.create(req,res)
};
module.exports = create;