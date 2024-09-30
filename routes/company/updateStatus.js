const { companyService } = require("../../services/CompanyService");
const Permission = require("../../helpers/Permission");

//systemLog
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");

async function updateStatus(req, res, next) {
    try {
        const data = req.body;
        const { id } = req.params;
        // Validate id
        if (!id) {
            return res.json(400, { message: "Company id is required" });
        }

        // Validate Name
        if (!data.status) {
            return res.json(400, { message: "Company status is required" });
        }
        // Update vendor Data
        const updateData = {
            status: data.status,
        };
        try {
            await companyService.update(updateData, {
                where: { id },
            });
            res.json(200, {
                message: "Company status updated",
            });

            // History
            res.on("finish", async () => {
                History.create("Company status updated", req,ObjectName.COMPANY,id);
            })

        } catch (err) {
            res.josn(400, err);
            next(err);
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = updateStatus;