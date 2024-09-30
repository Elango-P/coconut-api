
const orderService = require("../../services/OrderService");

const Permission = require("../../helpers/Permission");
const Request = require("../../lib/request");

async function update(req, res, next) {
  try{
    let rolePermission = Request.getRolePermission(req);

    const hasPermission = await Permission.GetValueByName(Permission.ORDER_EDIT, rolePermission);

    if (!hasPermission) {
      return res.json(400, { message: "Permission Denied" });
    }

    orderService.update(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = update;