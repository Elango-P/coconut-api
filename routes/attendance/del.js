const AttendanceService = require('../../services/AttendanceService');
const validator = require('../../lib/validator');
const Response = require("../../helpers/Response");

const del = async (req, res) => {
  try {
    const id = parseInt(req.params.id.trim());
    if (!validator.isInteger(id)) {
      return res.json(Response.BAD_REQUEST,{ message: 'Invalid Attendance Id' });
    }

    await AttendanceService.AttendanceDelete(id, req, res);
    res.json(Response.OK,{ message: "Attendance deleted" });

    
  } catch (err) {
    req.log.error(err);
  }
};

module.exports = del;
