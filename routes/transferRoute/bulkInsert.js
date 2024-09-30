const transferService = require('../../services/TransferService');

async function bulkInsert(req, res, next) {
  try {
      await transferService.bulkCreate(req, res, next);
  } catch (err) {
    console.log(err);
  }
}

module.exports = bulkInsert;
