const { AccountRatingService } = require("../../services/AccountRatingService");

async function get(req, res, next) {
  try{
    AccountRatingService.get(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = get;