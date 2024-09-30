
const projectComponentService = require("../../services/projectComponentService");

async function update(req, res, next) {
     projectComponentService.update(req,res,next);
};

module.exports = update;
