const Permission = require("../../helpers/Permission");
const transferService = require("../../services/TransferService");

async function update(req, res, next) {
  // Validate Permission exist or not
  const hasPermission = await Permission.Has(Permission.TRANSFER_EDIT, req);
  if (!hasPermission) {
    return res.json(400, { message: "Permission Denied" });
  }
  try{
    transferService.update(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = update;