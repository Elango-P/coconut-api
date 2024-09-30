const { AccountRatingService } = require("../../services/AccountRatingService");

async function create(req, res, next) {
  try {
    AccountRatingService.create(req, res, next);
  } catch (err) {
    console.log(err);
  }
}

module.exports = create;
