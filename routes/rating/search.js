const { AccountRatingService } = require("../../services/AccountRatingService");

async function search(req, res, next) {
    try{
        AccountRatingService.search(req, res, next)
    } catch(err){
        console.log(err);
    }
};

module.exports = search;