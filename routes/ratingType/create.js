/**
 * Module dependencies
 */
const models = require("../../db/models");
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Lib
const Request = require("../../lib/request");

// Models
const { RatingType } = require("../../db").models;

//systemLog
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
const RatingTypeStatus = require("../../helpers/RatingTypeStatus");
/**
 * Create rating type route
 */
async function create(req, res, next) {
  const data = req.body;

  const companyId = Request.GetCompanyId(req);

  // Validate name
  if (!data?.name) {
    return res.json(BAD_REQUEST, { message: "Name is required" });
  }

  // RatingType data
  const ratingTypeData = {
    name: data.name,
    status: data.status || RatingTypeStatus.ACTIVE,
    type: data.type || "",
    company_id: companyId,
  };

  try {
    const name = data.name.trim();

    // Validate duplicate RatingType name
    const productExist = await RatingType.findOne({
      where: { name, type: data.type, company_id: companyId },
    });
    if (productExist) {
      return res.json(BAD_REQUEST, {
        message: "RatingType Name Already Exist",
      });
    }
    // Create rating type
    const ratingTypeDetail = await RatingType.create(ratingTypeData);

    //create a log
    res.on("finish", async () => {
      History.create(
        "RatingType Created",
        req,
        ObjectName.RATING_TYPE,
        ratingTypeDetail?.id
      );
    });
    // API response
    res.json(OK, { message: "RatingType Added" });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}
module.exports = create;
