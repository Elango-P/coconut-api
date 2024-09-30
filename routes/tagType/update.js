/**
 * Module dependencies
 */
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");
const Permission = require("../../helpers/Permission");

// Models
const { TagType } = require("../../db").models;

//systemLog
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");

/**
 * TagType update route
 */
async function update(req, res, next) {

    const data = req.body;
    const { id } = req.params;
    const name = data.name;
    let company_id = Request.GetCompanyId(req);

    // Validate tag id
    if (!id) {
        return res.json(BAD_REQUEST, { message: "TagType id is required", })
    }

    // Validate tag is exist or not
    const tagDetails = await TagType.findOne({
        where: { id, company_id },
    });

    if (!tagDetails) {
        return res.json(BAD_REQUEST, { message: "Invalid tag id", })
    }

    // Validate product brand name is exist or not
    const tagDetail = await TagType.findOne({
        where: { name, company_id },
    });

    if (tagDetail && tagDetail.name !== tagDetails.name) {
        return res.json(BAD_REQUEST, { message: "TagType name already exist", })
    }

    // Update tag details
    const updateTag = {
        name: data.name,
    };
    try {
        const save = await tagDetails.update(updateTag);

        //create a log
        res.on("finish", async () => {
            //create system log for TagType updation
            History.create("Tag Type Updated", req,ObjectName.TAG_TYPE,id);
          });

        // API response
        res.json(UPDATE_SUCCESS, { message: "Tag Type Updated", data: save.get(), })
    } catch (err) {
console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};

module.exports = update;
