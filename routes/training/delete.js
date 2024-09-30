const TrainingService = require("../../services/TrainingService");

async function del(req, res, next) {

  try {
    TrainingService.delete(req, res, next)
  } catch (err) {
    console.log(err);
  }
};

module.exports = del;