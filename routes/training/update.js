const TrainingService = require("../../services/TrainingService");

async function update(req, res, next) {

  try {
    TrainingService.update(req, res, next)
  } catch (err) {
    console.log(err);
  }
};

module.exports = update;