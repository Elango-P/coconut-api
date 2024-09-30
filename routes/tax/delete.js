const TaxService = require('../../services/TaxService');

const del = async (req, res) => {
  TaxService.delete(req, res);
};
module.exports = del;
