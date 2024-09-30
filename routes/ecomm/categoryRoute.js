const bookMyWaterCanService = require("../../services/ecommUserService");

async function category(req, res, next) {
  try{
    bookMyWaterCanService.category(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = category;
