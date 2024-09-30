const { AccountRatingService } = require("../../services/AccountRatingService");


async function update(req, res, next) {

    try{
        AccountRatingService.update(req, res, next)
    } catch(err){
        console.log(err);
    }
}

module.exports = update;