const {
  userRolePermissionService,
  isNameExist,
} = require("../../services/UserRolePermissionService");
const async = require("async");

const Request = require("../../lib/request");
const History = require("../../services/HistoryService"); // Assuming HistoryService is the correct path
const ObjectName = require("../../helpers/ObjectName");

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function create(req, res, next) {
  try {
    const data = req.body;
    const roleId = req.query.roleId;
    let companyId = Request.GetCompanyId(req);

    // Create Role Permission Data
    try {
      const createData = {
        role_permission: data.label,
        company_id: parseInt(companyId),
        role_id: parseInt(roleId),
      };

       // check permission is exist
      const isNameExists = await isNameExist(data.label, roleId);

      // Uncheck the permission
      if (isNameExists) {
        await userRolePermissionService.deleteById(isNameExists.id);
        res.send(201, {
          message: "Role Permission Removed",
        });

        // Create history entry on response finish
        res.on("finish", async () => {
          const titleCaseLabel = toTitleCase(data.label);
          await History.create(
            `${titleCaseLabel} Permission Removed`,
            req,
            ObjectName.ROLE,
            roleId
          );
        });
      } else {
        // Creating permission
        await userRolePermissionService.create(createData);
        res.send(201, {
          message: "Role Permission Created",
        });

        // Create history entry on response finish
        res.on("finish", async () => {
          const titleCaseLabel = toTitleCase(data.label);
          await History.create(
            `${titleCaseLabel} Permission Created`,
            req,
            ObjectName.ROLE,
            roleId
          );
        });
      }
    } catch (err) {
      res.send(400, err);
      next(err);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
}

module.exports = create;
