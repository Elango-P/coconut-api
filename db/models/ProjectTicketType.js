// eslint-disable-next-line arrow-body-style

module.exports = (sequelize, DataTypes) =>{
	const status = require("./status")(sequelize, DataTypes);
	const Project = require("./Project")(sequelize, DataTypes);

	const projectTicketType  = sequelize.define("ProjectTicketType", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		project_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		type_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		sort: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
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
			allowNull: true,
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
			allowNull: true,
			defaultValue: 1
		},
		show_priority: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_component: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_label: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_affected_version: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_release_version: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_sprint: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_description: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_applicable_devices: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_environment: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_test_steps: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		show_actual_results: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_expected_results: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_delivery_date: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_initial_eta: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_eta_date: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_eta_time: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		show_story_points: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_jira_ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_parent_ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_user_impact: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_production_status: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_production_status_notes: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_type: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_build: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_reference_screenshots: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_reporter: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_assignee: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_reviewer: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		show_project: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_status: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_created_at: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_updated_at: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_jira_created_at: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_completed_at: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_customer_delivery_date: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		allow_to_create_parent_ticket: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		show_attachment_page_name: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		show_attachment_platform: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		show_attachment_summary: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		update_ticket_id_with_jira_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		show_sub_tasks: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		show_jira_assignee: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	
		  default_story_point: {
			type: DataTypes.INTEGER,
			allowNull: true,
		  },
		  sub_task_ticket_types: {
			type: DataTypes.STRING,
			allowNull: true
		},
		fields: {
			type: DataTypes.STRING,
			allowNull: true
		},

	}, {
		tableName: "project_ticket_type",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updatedAt",
		deletedAt: "deleted_at"
	});

	projectTicketType.belongsTo(status, {
		as: "statusDetail",
		targetKey: "ticket_type_id",
		foreignKey: "id",
	})

	projectTicketType.belongsTo(Project, {
		as: "projectDetail",
		foreignKey: "project_id",
	})

	
	return projectTicketType

};
