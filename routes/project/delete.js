

const projectService = require("../../services/ProjectService");
// Models


const del = async (req, res) => {

projectService.del(req,res);

}

module.exports = del;