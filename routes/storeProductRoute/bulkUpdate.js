const locationProductService = require('../../services/locationProductService');

async function bulkUpdate(req, res, next) {
 await locationProductService.bulkUpdate(req,res)
  }
  
  module.exports = bulkUpdate;
  