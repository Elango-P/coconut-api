/**
 * Module dependencies
 */
const models = require("../../db/models");
const { BAD_REQUEST, OK } = require("../../helpers/Response");


// Lib
const Request = require("../../lib/request");

// Models
const { TagType } = require("../../db").models;

//systemLog
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName")
/**
 * Create tag route
 */
async function create(req, res, next) {

    const data = req.body;
    const companyId = Request.GetCompanyId(req);

    // Validate name
    if (!data.name) {
        return res.json(BAD_REQUEST, { message: "Name is required", })
    }

    // Tag data
    const tagData = {
        name: data.name,
        company_id: companyId
    };

    try {
        const name = data.name.trim();

        // Validate duplicate Tag name
        const tagExist = await TagType.findOne({
            where: { name, company_id: companyId },
        });
        if (tagExist) {
            return res.json(BAD_REQUEST, { message: "Tag Type Name Already Exist", })
        }
        // Create tag
     const tagTypeDetail=   await TagType.create(tagData);

        //create a log
        res.on("finish", async () => {
            History.create("Tag Type Created", req,ObjectName.TAG_TYPE,tagTypeDetail?.id);
          });
        // API response
        res.json(OK, { message: "Tag Type Added" })
    } catch (err) {
console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};
module.exports = create;
