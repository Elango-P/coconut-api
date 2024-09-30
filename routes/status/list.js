
const Response = require("../../helpers/Response");
const statusService = require("../../services/StatusService");

async function create(req, res, next) {
  try{
   let data = await statusService.list(req, res, next)
    res.json(Response.OK, data);

} catch(err){
    console.log(err);
}
};

module.exports = create;