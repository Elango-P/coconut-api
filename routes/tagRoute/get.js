/**
 * Module dependencies
 */
const models = require("../../db/models");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const TagStatus = require("../../helpers/TagStatus");
const Request = require("../../lib/request");

// Models
const { Tag } = require("../../db").models;

/**
 * Tag get route by tag id
 */
async function get(req, res, next) {
    const { id } = req.params;
    let company_id = Request.GetCompanyId(req)
    // Validate tag id
    if (!id) {
        return res.json(BAD_REQUEST, { message: "Tag id is required", })
    }

    // Validate tag is exist or not
    const tagDetails = await Tag.findOne({
        where: { id, company_id },
    });

    // API response
    res.json(OK, {
        data: {
            id,
            name: tagDetails.name,
            default_amount: tagDetails.default_amount,
            status: tagDetails.status == TagStatus.ACTIVE ? TagStatus.STATUS_ACTIVE_TEXT : TagStatus.STATUS_INACTIVE_TEXT,
            type: tagDetails.type,
        },
    })
};

module.exports = get;
