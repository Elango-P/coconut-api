// Module Dependencies
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../../helpers/Response");

// Models
const { RatingType } = require("../../db").models;

//systemLog
const History = require("../../services/HistoryService");
const Request = require("../../lib/request");
const RatingTypeStatus = require("../../helpers/RatingTypeStatus");

// RatingType Status update route
async function updateStatus(req, res, next) {
  try {
    const data = req.body;
    const { id } = req.params;
    let company_id = Request.GetCompanyId(req);

    // Validate Rating Type id
    if (!id) {
      return res.json(BAD_REQUEST, { message: "RatingType id is required" });
    }

    // Validate Rating Type status
    if (!data.status) {
      return res.json(BAD_REQUEST, {
        message: "RatingType status is required",
      });
    }

    // Update Rating Type status
    const updateStatus = {
      status: data.status == "Active" ? RatingTypeStatus.ACTIVE : RatingTypeStatus.INACTIVE,
    };

    await RatingType.update(updateStatus, { where: { id, company_id } });

    History.create("RatingType Updated", req);

    res.json(UPDATE_SUCCESS, { message: "RatingType Updated" });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}
module.exports = updateStatus;
