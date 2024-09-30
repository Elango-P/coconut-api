const CustomFieldService = require("../../services/CustomFieldService");

async function updateSortOrder(req, res, next) {
  try{
    CustomFieldService.updateSortOrder(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = updateSortOrder;