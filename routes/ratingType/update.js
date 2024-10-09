/**
 * Module dependencies
 */
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");

// Models
const { RatingType } = require("../../db").models;

//systemLog
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");

/**
 * Rating Type update route
 */
async function update(req, res, next) {
  const data = req.body;
  const { id } = req.params;
  const name = data?.name;
  let company_id = Request.GetCompanyId(req);
  // Validate Rating Type id
  if (!id) {
    return res.json(BAD_REQUEST, { message: "Rating Type id is required" });
  }

  // Validate Rating Type is exist or not
  const ratingTypeDetails = await RatingType.findOne({
    where: { id, company_id },
  });

  if (!ratingTypeDetails) {
    return res.json(BAD_REQUEST, { message: "Invalid Rating Type id" });
  }

  // Validate product brand name is exist or not
  const typeDetail = await RatingType.findOne({
    where: { name, company_id },
  });

  if (typeDetail && typeDetail.name !== ratingTypeDetails.name) {
    return res.json(BAD_REQUEST, { message: "Ratinng name already exist" });
  }
  // Update Rating Type details
  const updateRatingType = {
    name: data?.name,
  };

  try {
    const save = await ratingTypeDetails.update(updateRatingType);

    //create a log
    res.on("finish", async () => {
      History.create("Rating Type Updated", req, ObjectName.RATING_TYPE, id);
    });
    // API response
    res.json(UPDATE_SUCCESS, {
      message: "Rating Type Updated",
      data: save.get(),
    });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}

module.exports = update;
