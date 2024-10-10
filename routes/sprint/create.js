const Permission = require("../../helpers/Permission");
const { sprintService } = require("../../services/SprintService ");
const Response = require("../../helpers/Response");

// Models
const { Sprint } = require("../../db").models;

const create = async (req, res) => {

    await sprintService.create(req, res);
};
module.exports = create;