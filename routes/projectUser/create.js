const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");
const history = require("../../services/HistoryService");
const projectuser = require("../../services/ProjectUserService");
const ProjectUser = require("../../helpers/ProjectUser");
// Models
const { Project } = require("../../db").models;

const create = async (req, res) => {
  let data = req.body;

  const company_id = Request.GetCompanyId(req);

  let params = {
    company_id: company_id,
    project_id: data?.projectId,
    user_id: data?.userId,
    status: data?.status || ProjectUser.ACTIVE,
  };

  let projectDetails = await projectuser.create(params, res);

  res.json(200, {
    message: "User Added",
    projectDetails: projectDetails,
  });

  res.on("finish", () => {
    // Create system log for sprint creation
    history.create("Project User Added", req, ObjectName.PROJECT, projectDetails.id);
  });
};
module.exports = create;