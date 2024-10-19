const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const Request = require("../../lib/request");
const transferService = require("../../services/TransferService");

async function create(req, res, next) {
  const companyId = Request.GetCompanyId(req);

  if (!companyId) {
    return res.json(Response.BAD_REQUEST, { message: "Company Not Found" });
  }

  let rolePermission = Request.getRolePermission(req);

  // order add permission check
  const hasPermission = await Permission.GetValueByName(Permission.TRANSFER_ADD, rolePermission);

  if (!hasPermission) {
    return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
  }

  // manage other permission check
  const manageOthers = await Permission.GetValueByName(
    Permission.TRANSFER_MANAGE_OTHERS,
    rolePermission
  );

  if (!manageOthers) {
    let lastCheckIn = Request.getCurrentLocationId(req);

    if (!lastCheckIn) {
      return res.json(Response.BAD_REQUEST, {
        message: "Check-in record is missing",
      });
    }
  }

 

  try {
    transferService.create(req, res, next)
  } catch (err) {
    console.log(err);
  }
};

module.exports = create;