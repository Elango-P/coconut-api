
const orderService = require("../../services/OrderService");

const Permission = require("../../helpers/Permission");

const Request = require("../../lib/request");

const Response = require("../../helpers/Response");
const invoiceService = require("../../services/invoiceService");

async function completeOrder(req, res, next) {
    try {

        const hasPermission = await Permission.Has(Permission.ORDER_EDIT, req);

        if (!hasPermission) {
            return res.json(400, { message: "Permission Denied" });
        }

        let { id } = req.params;

        let body = req.body;

        let companyId = Request.GetCompanyId(req);

        let userId = Request.getUserId(req);

        await orderService.completeOrder(id, body, companyId, userId);

        res.json(Response.OK, {
            message: ` Order Updated`,
        });

        res.on("finish", async () => {
            await invoiceService.create(id, companyId)
          });
    } catch (err) {
        res.json(Response.BAD_REQUEST, {
            message: err.message,
        });
    }
};

module.exports = completeOrder;