// Status
const { BAD_REQUEST, OK }  = require("../../helpers/Response");
const Permission = require("../../helpers/Permission");

// Services
const orderService = require("../../services/OrderService");
const Request = require("../../lib/request");
const Response = require("../../helpers/Response");

 async function search(req, res, next){

    const companyId = Request.GetCompanyId(req);

    const params = req.query;
    if (!companyId) {
      return res.json(Response.BAD_REQUEST, { message: "Company Not Found" });
    }

    let rolePermission = Request.getRolePermission(req);

    // order add permission check
    const hasPermission = await Permission.GetValueByName(Permission.ORDER_VIEW, rolePermission);

    if (!hasPermission) {
      return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
    }

    // manage other permission check
    const manageOthers = await Permission.GetValueByName(
      Permission.ORDER_MANAGE_OTHERS,
      rolePermission
    );

    if (!manageOthers) {
      let lastCheckIn = Request.getCurrentLocationId(req);
      params.currentLocation = Request.getCurrentLocationId(req);
      if (!lastCheckIn) {
        return res.json(Response.BAD_REQUEST, {
          message: "Location Is Missing",
        });
      }
    }
    params.currentShift = Request.getCurrentShiftId(req);

    try {
        const data = await orderService.searchOrder(params,req);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {
            message: err.message 
       });
    }
};
module.exports = search;
