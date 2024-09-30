const TaxService = require('../../services/TaxService');

const search = async (req, res) => {
  TaxService.search(req, res);
};
module.exports = search;
