const utils = require("../../lib/utils");
const types = require("./types");
const MediaService = require("../../services/MediaService");

const DateTime = require("../../lib/dateTime");

async function process(result, isAdmin) {
	try {
		const attendance = result.get();
		
		const user = attendance.user;

		return {
			id: attendance.id,
			userId: attendance.user_id,
			media_url: user?.media_url,
			userName: user?.name,
			lastName: user?.last_name,
			date: DateTime.formatDate(attendance.date, "YYYY-MM-DD"),
			login: DateTime.formatLocalDate(attendance.login, "DD-MM-YYYY LT"),
			logout: DateTime.formatLocalDate(attendance.logout, "DD-MM-YYYY LT"),
			lateHours: attendance.late_hours && attendance.late_hours > 0 && DateTime.convertMinutesToTime(attendance.late_hours) || "",
			notWorkedHours: DateTime.covertToHoursAndMinutes(attendance.not_worked_hours),
			productiveHours: DateTime.covertToHoursAndMinutes(attendance.productive_hours),
			nonProductiveHours: DateTime.covertToHoursAndMinutes(attendance.non_productive_hours),
			notes: attendance.notes,
			additionalHours: attendance.additional_hours && attendance.additional_hours > 0 && DateTime.convertMinutesToTime(attendance.additional_hours) || "",
			ipAddress: attendance.ip_address,
			workedHours: DateTime.covertToHoursAndMinutes(attendance.worked_hours),
			type: attendance?.type,
			typeText: types.getText(attendance.type),
			status: attendance.status,
			lateHoursStatus: attendance?.late_hours_status,
			activityStatus: attendance.activity_status,
			canUpdate: isAdmin,
			productiveCost: attendance.productive_cost,
			nonProductiveCost: attendance.non_productive_cost,
			lopHours: DateTime.covertToHoursAndMinutes(attendance.lop_hours),
			locationName: attendance.location ? attendance.location.name : "",
			location: attendance.store_id,
			shiftName: attendance.shift ? attendance.shift.name : "",
			shift_id: attendance.shift_id ? attendance.shift_id : "",
			login: attendance.login,
			logout: attendance.logout,
			dateTime: attendance.date,
			allow_early_checkout : attendance?.allow_early_checkout,
			allow_goal_missing : attendance?.allow_goal_missing,
			approve_late_check_in : attendance?.approve_late_check_in,
			check_in_media_id: attendance?.check_in_media_id && await MediaService.getMediaURL(attendance?.check_in_media_id, attendance.company_id),
			days_count: attendance?.days_count,
			typeName: attendance?.attendanceTypeDetail?.name,
			attendanceTypeDetail: attendance?.attendanceTypeDetail
		};
	} catch (err) {
		console.log(err);
	}
}

module.exports = process;
