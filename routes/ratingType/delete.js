/**
 * Module dependencies
 */
const { BAD_REQUEST, DELETE_SUCCESS } = require("../../helpers/Response");

// Models
const { RatingType } = require("../../db").models;

//systemLog
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");

/**
 * RatingType delete route by RatingType Id
 */
async function del(req, res, next) {
  const { id } = req.params;
  let company_id = Request.GetCompanyId(req);

  try {
    // Validate RatingType id
    if (!id) {
      return res.json(BAD_REQUEST, { message: "RatingType id is required" });
    }

    // Validate RatingType is exist or not
    const ratingTypeDetails = await RatingType.findOne({
      where: { id, company_id },
    });
    if (!ratingTypeDetails) {
      return res.json(BAD_REQUEST, { message: "RatingType not found" });
    }

    // Delete RatingType
    await ratingTypeDetails.destroy();

    res.on("finish", async () => {
      History.create("RatingType deleted", req, ObjectName.RATING_TYPE, id);
    });
    res.json(DELETE_SUCCESS, { message: "RatingType deleted" });
  } catch (err) {
    console.log(err);
  }
}
module.exports = del;
