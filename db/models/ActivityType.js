module.exports = (sequelize, DataTypes) =>
	sequelize.define("ActivityType", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		question: {
			type: DataTypes.STRING,
			allowNull: true
		},
		sort: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		user_roles: {
			type: DataTypes.STRING,
			allowNull: true
		},
		default_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "Productive"
		},
		is_screenshot_required: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		allow_date_selection: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		is_code_commit_required: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		is_ticket_required: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		max_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		max_entries_per_day: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		auto_add: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		show_executed_test_case_count: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		show_reported_tickets_count: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		approvers: {
			type: DataTypes.STRING,
			allowNull: true
		},
		show_hour_selection: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		required: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		update_logout: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		update_login: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		validate_pending_activities: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		validate_required_activities: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		user_ids: {
			type: DataTypes.STRING,
			allowNull: true
		},
		validate_working_hours: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		validate_productive_hours: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		validate_productivity_cost: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		validate_reported_tickets: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		validate_completed_tickets: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		need_explanation: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		allow_manual_entry: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: true
		},
		validate_eta: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		model: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ticket_types: {
			type: DataTypes.STRING,
			allowNull: true
		},
		show_notes: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		slack_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		validate_needexplanation_activities: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: true
		},
		show_in_user_status: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: true
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true
		},
		is_ticket_activity: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: true
		},
		validate_next_working_day_story_points: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		validate_reported_tickets_story_points: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: true
		},
		notify_user: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		validate_pending_review_tickets: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		group: {
			type: DataTypes.INTEGER,
			allowNull: true
		}

	}, {
		tableName: "activity_type",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: "deleted_at",
		paranoid: true
	});
