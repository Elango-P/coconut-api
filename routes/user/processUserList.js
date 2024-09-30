const PreferredLocation = require("../../helpers/PreferredLocation");
const utils = require("../../lib/utils");
const user = require("../admin/user");
const roles = require("./roles");
const StatusActive = require("./statusActive");
const {  PreferredLocation:PreferredLocationModel } = require("../../db").models;

async function processUserList(result) {
	const userList = result.get();
	let userDetail = await PreferredLocationModel.findOne({
		where: { user_id: userList?.id, company_id: userList?.company_id, preferred_order:PreferredLocation.FIRST_ORDER },
	  });
	return {
		id: userList.id,
		
		name: userList.name,
		lastName: userList.last_name,
		email: userList.email,
		role: userList.role,
		roleText: roles.getText(userList.role),
		profilePhoto: userList.profile_photo,
		avatarUrl: userList.media_url,
		mobile: userList.mobile_number1,
		active: userList.active,
		activeText: StatusActive.getText(userList.active),
		availableLeaveBalance: userList.available_leave_balance,
		loginTime: userList.login_time,
		lastLoggedinAt: userList.last_loggedin_at,
		dateOfJoining: userList.date_of_joining,
		dateOfJoiningFormattedDate: utils.formatDate(userList.date_of_joining, "DD-MM-YYYY"),
		status: userList.status,
		forceDailyUpdate: userList.force_daily_update,
		slackId: userList.slack_id,
		primary_shift_id:userDetail && userDetail?.shift_id,
		primary_location_id:userDetail && userDetail?.location_id
		
	};
}

module.exports = processUserList;
