const TaxService = require('../../services/TaxService');

const create = async (req, res) => {
  TaxService.create(req, res);
};
module.exports = create;
