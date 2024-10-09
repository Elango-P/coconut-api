/**
 * Module dependencies
 */
const models = require("../../db/models");
const RatingTypeStatus = require("../../helpers/RatingTypeStatus");
const { BAD_REQUEST, OK } = require("../../helpers/Response");
const Request = require("../../lib/request");

// Models
const { RatingType } = require("../../db").models;

/**
 * RatingType get route by RatingType id
 */
async function get(req, res, next) {
    const { id } = req.params;
    let company_id = Request.GetCompanyId(req)
    // Validate RatingType id
    if (!id) {
        return res.json(BAD_REQUEST, { message: "RatingType id is required", })
    }

    // Validate RatingType is exist or not
    const ratingTypeDetail = await RatingType.findOne({
        where: { id, company_id },
    });

    // API response
    res.json(OK, {
        data: {
            id,
            name: ratingTypeDetail.name,
            status: ratingTypeDetail.status == RatingTypeStatus.ACTIVE ? RatingTypeStatus.STATUS_ACTIVE_TEXT : RatingTypeStatus.STATUS_INACTIVE_TEXT,
            type: ratingTypeDetail.type,
        },
    })
};

module.exports = get;
