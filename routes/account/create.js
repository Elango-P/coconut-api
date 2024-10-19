

const Permission = require("../../helpers/Permission");
const Response = require("../../helpers/Response");
const AccountService = require("../../services/AccountService")


/**
 * Create vendor route
 */
async function create(req, res, next) {
    const hasPermission = await Permission.Has(Permission.ACCOUNT_ADD, req);

    if (!hasPermission) {

        return res.json(Response.BAD_REQUEST, { message: "Permission Denied" });
    }
    try {

        AccountService.create(req, res, next)
    } catch (err) {
        console.log(err);
    }
};
module.exports = create;
