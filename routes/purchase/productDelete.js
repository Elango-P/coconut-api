
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");

// Models
const { PurchaseProduct } = require("../../db").models;

const History = require("../../services/HistoryService");

const { hasPermission } = require("../../services/UserRolePermissionService");

const del = async (req, res) => {
    const { id } = req.params;

    try {

        //get stock product entry Id
        //get company Id from request
        const companyId = Request.GetCompanyId(req);

        //validate stock product entry Id exist or not
        if (!id) {
            return res.json(400, { message: "Purchase Product Id is required" });
        }

        //validate stock entry product exist or not
        let isBillProductExist = await PurchaseProduct.findOne({
            where: { company_id: companyId, id: id }
        })

        //validate stock entry product exist or not
        if (!isBillProductExist) {
            return res.json(400, { message: "Purchase Product Not Found" });
        }

        //delete the stock entry product
        await PurchaseProduct.destroy({ where: { company_id: companyId, id: id } })

        res.json(200, { message: "Purchase Product Deleted" });
        res.on("finish", async () => {
            History.create(`Purchase Product ${isBillProductExist?.product_id} Deleted`, req, ObjectName.PURCHASE, isBillProductExist?.purchase_id);
        });

    } catch (err) {
        console.log(err);
        return res.json(400, { message: err.message });
    }
}

module.exports = del;