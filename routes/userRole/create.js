// import service
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");
const history = require("../../services/HistoryService");
const { userRoleService, isNameExist } = require("../../services/UserRoleService");

async function create(req, res, next) {
  try {
    const data = req.body;
    data.company_id = Request.GetCompanyId(req);

    //Validation
    const isNameExists = await isNameExist(data.role_name , company_id=data.company_id);
    if (isNameExists) {
      return res.json(400, { message: "Role Already Exist" });
    }

    // Create Role Data
   
    let createData = userRoleService.toDbObject(data);

    try {
      let response = await userRoleService.create(createData);
      res.send(200, { message: "Role Created" });
      res.on("finish", async () => {
        history.create("Role Created", req, ObjectName.ROLE, response?.id);
    });
    } catch (err) {
      res.send(400, err);
      next(err);
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = create;
