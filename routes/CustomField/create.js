const CustomFieldService = require("../../services/CustomFieldService");

async function create(req, res, next) {
  try{
    CustomFieldService.create(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = create;
