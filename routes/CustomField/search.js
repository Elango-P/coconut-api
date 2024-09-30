const CustomFieldService = require("../../services/CustomFieldService");

async function search(req, res, next) {
  try{
    CustomFieldService.search(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = search;
