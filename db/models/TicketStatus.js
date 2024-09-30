module.exports = (sequelize, DataTypes) =>
	sequelize.define("TicketStatus", {
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
		sort: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			
		},
		group_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		roles: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		jira_status_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		required_review: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		allow_test_case_status_change: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		allow_task_status_change: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue:false
		},
		story_points_required: {
			type: DataTypes.BOOLEAN,
			allowNull:true,
			defaultValue:false
		},
		allow_task_add: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue:false
		},
		reset_reviewer: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue:false
		},
		allow_subticket_create: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		default_assignee: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		force_default_assignee: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		summary_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		description_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		test_steps_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		expected_results_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		actual_results_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		acceptance_criteria_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		production_status_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		production_status_notes_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		user_impact_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		attachment_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		applicable_devices_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		environment_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		build_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		release_version_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		affected_version_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		ETA_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		assignee_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		label_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		test_validation: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		task_validation: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		minimum_test_count: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		project_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		validate_reported_tickets: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		project_type_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		jira_ticket_id_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		default_reviewer: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		default_eta: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		set_completed_at: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		allow_to_add_test_case: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		default_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		notify_assignee: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		notify_reporter: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		notify_reviewer: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		severity_required: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "ticket_status",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});
