const ActivityTypeGroup = require("../../helpers/ActivityTypeGroup");

function activityType(result) {
	const activityTypeList = result.get();

	return {
		id: activityTypeList.id,
		name: activityTypeList.name,
		type: activityTypeList.type,
		user_roles: activityTypeList.user_roles,
		question: activityTypeList.question,
		sort: activityTypeList.sort,
		is_screenshot_required: activityTypeList.is_screenshot_required,
		is_ticket_required: activityTypeList.is_ticket_required,
		max_hours: activityTypeList.max_hours,
		max_entries_per_day: activityTypeList.max_entries_per_day,
		auto_add: activityTypeList.auto_add,
		show_executed_test_case_count: activityTypeList.show_executed_test_case_count,
		show_reported_tickets_count: activityTypeList.show_reported_tickets_count,
		approvers: activityTypeList.approvers,
		show_hour_selection: activityTypeList.show_hour_selection,
		update_logout: activityTypeList.update_logout,
		update_login: activityTypeList.update_login,
		validate_pending_activities: activityTypeList.validate_pending_activities,
		required: activityTypeList.required,
		user_ids: activityTypeList.user_ids,
		validate_working_hours: activityTypeList.validate_working_hours,
		validate_productive_hours: activityTypeList.validate_productive_hours,
		need_explanation: activityTypeList.need_explanation,
		ticket_types: activityTypeList.ticket_types,
		allow_manual_entry: activityTypeList.allow_manual_entry,
		validate_eta: activityTypeList.validate_eta,
		validate_productivity_cost: activityTypeList.validate_productivity_cost,
		validate_reported_tickets: activityTypeList.validate_reported_tickets,
		validate_completed_tickets: activityTypeList.validate_completed_tickets,
		default_status: activityTypeList.default_status,
		model_name: activityTypeList.model,
		show_notes: activityTypeList.show_notes,
		slack_id: activityTypeList.slack_id,
		validate_needexplanation_activities: activityTypeList.validate_needexplanation_activities,
		validate_next_working_day_story_points: activityTypeList.validate_next_working_day_story_points,
		validate_reported_tickets_story_points: activityTypeList.validate_reported_tickets_story_points,
		is_code_commit_required: activityTypeList.is_code_commit_required,
		show_in_user_status: activityTypeList.show_in_user_status,
		allow_date_selection: activityTypeList.allow_date_selection,
		validate_required_activities: activityTypeList.validate_required_activities,
		notify_user: activityTypeList.notify_user,
		is_ticket_activity: activityTypeList.is_ticket_activity,
		max_entries_per_day: activityTypeList.max_entries_per_day,
		validate_pending_review_tickets: activityTypeList.validate_pending_review_tickets,
		activityTypeGroup: activityTypeList.group,
		activityTypeGroupText: activityTypeList.group == ActivityTypeGroup.CHECK_IN ? ActivityTypeGroup.CHECK_IN_TEXT : activityTypeList.group == ActivityTypeGroup.CHECK_OUT ? ActivityTypeGroup.CHECK_OUT_TEXT : ""



	};
}
module.exports = activityType;
