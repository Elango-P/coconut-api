const Permission = require("../../helpers/Permission");
const Request = require("../../lib/request");
const AttendanceService = require("../../services/AttendanceService");
const validator = require("../../lib/validator");
const Response = require("../../helpers/Response");

const bulkDelete = async (req, res) => {
  try {
    const ids = req?.body?.selectedId;
    if (!ids || !Array.isArray(ids)) {
      return res.json(Response.BAD_REQUEST,{ message: "Invalid IDs provided" });
    }

    const deletePromises = [];

    for (const id of ids) {
      try {
        if (!validator.isInteger(id)) {
          throw new Error(`Invalid Attendance Id: ${id}`);
        }

        deletePromises.push(AttendanceService.AttendanceDelete(id, req, res));
      } catch (error) {
        console.error("Error processing ID:", error.message);
      }
    }

    await Promise.all(deletePromises);
    res.json(Response.OK,{ message: "Attendance deleted" });

  } catch (err) {
    console.error(err);
  }
};

module.exports = bulkDelete;
