
const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const { sprintService } = require("../../services/SprintService ");


/**
 * Sprint update route
 */
async function update(req, res, next) {

 sprintService.update(req,res,next);
};

module.exports = update;
