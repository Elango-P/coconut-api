const History = require("../../services/HistoryService");
const validator = require("../../lib/validator");
const { OK } = require("../../helpers/Response");
const ObjectName = require("../../helpers/ObjectName");
const { Media } = require("../../db").models;
const Request =require("../../lib/request")



async function bulkUpdate(req, res, next) {

    try {
        const data = req.body;
        const mediaIds = data.ids;
        let company_id = Request.GetCompanyId(req)

        // mediaIds Exist
        if (!mediaIds) {
            return next(validator.validationError("Media Ids is Required"));
        }

        let mediaData = [];

        if (data.visibility) {
            mediaData.visibility = data.visibility;
        }

        let mediasIds = mediaIds.split(",");


        await Media.update(mediaData, {
            where: { id: mediasIds, company_id }
        })
            .then(() => {
                res.json(OK,{ message: "Media Updated" });
                res.on("finish", async () => {
                    History.create("Media Updated", req,ObjectName.MEDIA,mediasIds)
                })
            }).catch((err)=>{
                console.log(err);
            })

    } catch (err) {
    }



}

module.exports = bulkUpdate;