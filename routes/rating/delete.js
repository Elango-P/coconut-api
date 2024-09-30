const { AccountRatingService } = require("../../services/AccountRatingService");

async function del(req, res, next) {
  try{
    AccountRatingService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;