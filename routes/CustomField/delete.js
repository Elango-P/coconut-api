const CustomFieldService = require("../../services/CustomFieldService");

async function del(req, res, next) {
  try{
    CustomFieldService.delete(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;
