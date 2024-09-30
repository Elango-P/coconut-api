/**
 * Module dependencies
 */
const models = require("../../db/models");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const Request = require("../../lib/request");

// Models
const { TagType } = require("../../db").models;

/**
 * TagType get route by tag id
 */
async function get(req, res, next) {
    const { id } = req.params;
    const companyId = Request.GetCompanyId(req);

    // Validate tag id
    if (!id) {
        return res.json(BAD_REQUEST, { message: "Tag Type id is required", })
    }

    // Validate tag is exist or not
    const tagDetails = await TagType.findOne({
        where: { id, company_id: companyId },
    });
    // API response
    res.json(OK, {
        data: {
            id,
            name: tagDetails.name,
            type: tagDetails.type,
        },
    })
};

module.exports = get;
