const bookMyWaterCanService = require("../../services/ecommUserService");

async function signUp(req, res, next) {
  try{
    bookMyWaterCanService.signUp(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = signUp;
