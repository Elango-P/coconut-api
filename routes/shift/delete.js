
const ObjectName = require("../../helpers/ObjectName");
const Permission = require("../../helpers/Permission");
const Request = require("../../lib/request");
const History = require("../../services/HistoryService");

// Models
const { Shift } = require("../../db").models;

const del = async (req, res) => {
    let ShiftId = req.params.id;
    try {
        //get company Id from request
        //get company Id from request
        const companyId = Request.GetCompanyId(req);

        //validate Order Id exist or not
        if (!ShiftId) {
            return res.json(400, { message: "Shift Not Found" });
        }

        //delete Order
        await Shift.destroy({ where: { id: ShiftId, company_id: companyId } });

        res.json(200, { message: "Shift Deleted" });
        
        // History On Finish Function
        res.on(("finish"), async () => {
            History.create("Shift Deleted", req, ObjectName.SHIFT, ShiftId);
        })

    } catch (err) {
        console.log(err);
            return res.json(400, { message: err.message });
    }
}

module.exports = del;