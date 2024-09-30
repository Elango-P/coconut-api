const ObjectName = require("../../helpers/ObjectName");
const { BAD_REQUEST } = require("../../helpers/Response");
const Request = require("../../lib/request");
const History = require("../../services/HistoryService");
const { Inspection } = require("../../db").models;


async function create(req, res, next) {
    try {
        const data = req.body;

        const companyId = Request.GetCompanyId(req);

        const userId = Request.getUserId(req);

        if (!data.tagId) {
            return res.json(400, { message: "Tag Id Is Is Required" });
        }

        if (!data.storeId) {
            return res.json(400, { message: "Location Id Is Required" });
        }

        let createData = {
            tag_id: data.tagId,
            owner_id: userId,
            company_id: companyId,
            store_id: data.storeId
        }

        const inspections = await Inspection.create(createData);

        // systemLog
        res.json(200, {
            message: "Inspection Created",
            inspection: inspections,
        });
        res.on("finish", async () => {
            //create system log for sale updation
            History.create("Inspection Created", req, ObjectName.CUSTOM_FORM, inspections.id);

        });

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {
            message: err.message
        });
    }
};

module.exports = create;