

const projectUserService = require("../../services/ProjectUserService");
// Models


const del = async (req, res) => {

projectUserService.del(req,res);

}

module.exports = del;