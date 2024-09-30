const TaxService = require('../../services/TaxService');

const update = async (req, res) => {
  TaxService.update(req, res);
};
module.exports = update;