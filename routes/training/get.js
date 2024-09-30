const TrainingService = require("../../services/TrainingService");

async function get(req, res, next) {

  try {
    TrainingService.get(req, res, next)
  } catch (err) {
    console.log(err);
  }
};

module.exports = get;