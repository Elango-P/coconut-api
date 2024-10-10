const Permission = require("../../helpers/Permission");
const VisitorService  = require("../../services/VisitorService");


async function del(req, res, next) {
  try{

    VisitorService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;