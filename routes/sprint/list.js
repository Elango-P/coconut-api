const { sprintService } = require("../../services/SprintService ");

// Models
const { Sprint } = require("../../db").models;

const list = async (req, res) => {

await  sprintService.list(req,res);
};
module.exports = list;