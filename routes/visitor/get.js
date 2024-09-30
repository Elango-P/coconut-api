const VisitorService  = require("../../services/VisitorService");

async function get(req, res, next) {
  try{
    VisitorService.get(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = get;