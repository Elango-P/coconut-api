const attendanceService = require("../../services/AttendanceService");

function updateLogout(req, res, next) {
	attendanceService.updateAutoLogout("", (err) => {
		if (err) {
			return next(err);
		}

		res.json({ message: "Added Logout time for empty attendance records" });
	});
};

module.exports = updateLogout;
