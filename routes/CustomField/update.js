const CustomFieldService = require("../../services/CustomFieldService");

async function update(req, res, next) {
  try{
    CustomFieldService.update(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = update;
