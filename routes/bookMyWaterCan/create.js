const bookMyWaterCanService = require("../../services/ecommUserService");

async function create(req, res, next) {
  try{
    bookMyWaterCanService.create(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = create;
