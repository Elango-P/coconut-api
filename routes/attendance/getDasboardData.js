const AttendanceService = require("../../services/AttendanceService");

const Request = require("../../lib/request");

const { BAD_REQUEST } = require("../../helpers/Response");

async function del(req, res, next) {
  try {

    const companyId = Request.GetCompanyId(req);

    const userId = Request.getUserId(req);

    const timeZone = Request.getTimeZone(req)
    let currendtShiftId = Request.getCurrentShiftId(req);

    let forceSync = req && req.user && req.user.force_sync
    let responseData = await AttendanceService.getDashboardData(userId, companyId,timeZone,currendtShiftId);

    responseData.forceSync = forceSync

    // API response
    res.json(responseData);

  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, {
      message: err.message
    });
  }
};

module.exports = del;