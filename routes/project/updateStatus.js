const projectService = require("../../services/ProjectService");
async function updateStatus(req, res, next) {
    try {
        projectService.updateByStatus(req, res, next)
       
      } catch (err) {
        console.log(err);
        return res.json(400, { message: err.message });
      }
}module.exports = updateStatus;