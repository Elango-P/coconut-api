// Status
const ObjectName = require("../../helpers/ObjectName");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const History = require("../../services/HistoryService");

const { Media } = require("../../db").models;

const Request = require("../../lib/request");
const { reindex } = require("../../services/ProductService");

async function del(req, res, next) {
    try {
        const { id } = req.params;
        const company_id = Request.GetCompanyId(req);

        let isMediaExist = await Media.findOne({
            where: { id: id, company_id: company_id }
        })

        if (isMediaExist) {
            await Media.destroy({ where: { id: id, company_id: company_id } })
        }

        // API response
        res.json(OK, {
            message: "Media Deleted"
        });


        res.on("finish", async () => {

            // ReIndex Function
            if (isMediaExist.object_name == ObjectName.PRODUCT && isMediaExist.object_id) {
                await reindex(isMediaExist.object_id, company_id);
            }

            History.create("Media Deleted", req,
                isMediaExist.object_name,
                isMediaExist.object_id);
        })
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {
            message: err.message
        });
    }
};
module.exports = del;
