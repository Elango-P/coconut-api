const TrainingService = require("../../services/TrainingService");

async function create(req, res, next) {

  try {
    TrainingService.create(req, res, next)
  } catch (err) {
    console.log(err);
  }
};

module.exports = create;