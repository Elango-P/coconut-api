const errors = require("restify-errors");
const validator = require("../../lib/validator");

const { Attendance } = require("../../db").models;

/**
 * Attendance Update
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateCost(req, res, next) {
  const attendanceId = req.params.attendanceId;
  if (!validator.isInteger(attendanceId)) {
    return next(new errors.BadRequestError("Invalid Attendance Id"));
  }

  const data = req.body;

  Attendance.findOne({
    attributes: ["id"],
    where: { id: attendanceId },
  }).then((attendance) => {
    if (!attendance) {
      return next(new errors.NotFoundError("Attendance not found"));
    }

    attendance
      .update({
        non_productive_cost: data.nonProductiveCost,
      })
      .then((attendanceDetail) => {
        res.json({
          message: "Attendance Updated successfully",
          attendanceId: attendanceDetail.get("id"),
        });
      })
      .catch((err) => {
        req.log.error(err);
        return next(err);
      });
  });
}

module.exports = updateCost;
