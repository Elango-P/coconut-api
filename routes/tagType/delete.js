/**
 * Module dependencies
 */
const ObjectName = require("../../helpers/ObjectName");
const { BAD_REQUEST, DELETE_SUCCESS } = require("../../helpers/Response");
const Request = require("../../lib/request");

// Models
const { TagType } = require("../../db").models;

//systemLog
const History = require("../../services/HistoryService");

/**
 * TagType delete route by tag Id
 */
async function del(req, res, next) {
    const { id } = req.params;

    try {
        let company_id = Request.GetCompanyId(req)
        // Validate tag id
        if (!id) {
            return res.json(BAD_REQUEST, { message: "Tag Type id is required", })
        }

        // Validate tag is exist or not
        const tagDetails = await TagType.findOne({
            where: { id , company_id},
        });
        if (!tagDetails) {
            return res.json(BAD_REQUEST, { message: "Tag Type not found", })
        }

        // Delete tag
        await tagDetails.destroy();
        res.on("finish", async () => {
            History.create("Tag Type deleted", req,ObjectName.TAG_TYPE,id);
          });

        res.json(DELETE_SUCCESS, { message: "Tag Type deleted", })
    } catch (err) {
        console.log(err);
    }
};
module.exports = del;
