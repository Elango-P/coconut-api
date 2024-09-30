const TrainingService = require("../../services/TrainingService");

async function search(req, res, next) {

  try {
    TrainingService.search(req, res, next)
  } catch (err) {
    console.log(err);
  }
};

module.exports = search;