module.exports = (sequelize, DataTypes) =>
	sequelize.define("TicketType", {
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
		role: {
			type: DataTypes.STRING,
			allowNull: true
		},
		sort: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		ticket_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		test_case_creation_time: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		test_case_execution_time: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		show_test_cases: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_tasks: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_estimated_hours: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		show_poa: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_acceptance_criteria: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_severity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_priority: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_component: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_label: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_affected_version: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_release_version: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_sprint: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_description: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_applicable_devices: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_environment: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_test_steps: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		show_actual_results: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_expected_results: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_delivery_date: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_initial_eta: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_eta_date: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_eta_time: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		show_story_points: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_jira_ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_parent_ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_user_impact: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_production_status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_production_status_notes: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_type: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_build: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_reference_screenshots: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_reporter: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_assignee: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_reviewer: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_project: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_created_at: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_updated_at: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_jira_created_at: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_completed_at: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		show_customer_delivery_date: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "ticket_type",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: false,
		paranoid: true,
	});
