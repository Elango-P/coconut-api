module.exports = (sequelize, DataTypes) => {
	const projectUser = require("./ProjectUser")(sequelize, DataTypes);
	const TicketStatus = require("./TicketStatus")(sequelize, DataTypes);
	const Activity = require("./Activity")(sequelize, DataTypes);

	const IndexTicket = sequelize.define("IndexTicket", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		ticket_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ticket_url: {
			type: DataTypes.STRING,
			allowNull: true
		},
		external_ticket_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		parent_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		parent_ticket_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		parent_ticket_url: {
			type: DataTypes.STRING,
			allowNull: true
		},
		summary: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		project_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		project_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		status_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status_group_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		type_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		type_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		affected_version: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		affected_version_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		sprint_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		sprint_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		release_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		release_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		priority: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		priority_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		severity_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		severity_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		component: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		component_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		labels: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		acceptance_criteria: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		environment: {
			type: DataTypes.STRING,
			allowNull: true
		},
		build_number: {
			type: DataTypes.STRING,
			allowNull: true
		},
		test_step: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		actual_results: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		expected_results: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		reference_screenshots: {
			type: DataTypes.JSON,
			allowNull: true
		},
		reported_by: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		reported_by_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		assigned_to: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		assigned_to_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		reviewer: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		reviewer_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: true
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: true
		},
		jira_created_at: {
			type: DataTypes.DATE,
			allowNull: true
		},
		eta: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		completed_at: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		estimated_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		actual_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		system_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		tested_environment: {
			type: DataTypes.STRING,
			allowNull: true
		},
		tested_build: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_status_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status_changed_at: {
			type: DataTypes.DATE,
			allowNull: true
		},
		jira_host: {
			type: DataTypes.STRING,
			allowNull: true
		},
		trello_board_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_ticket_url: {
			type: DataTypes.STRING,
			allowNull: true
		},
		trello_ticket_url: {
			type: DataTypes.STRING,
			allowNull: true
		},
		test_suite_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		delivery_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		updated_eta: {
			type: DataTypes.DATE,
			allowNull: true
		},
		applicable_devices: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		production_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		customer_delivery_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		customer_estimated_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		user_impact: {
			type: DataTypes.STRING,
			allowNull: true
		},
		production_status_notes: {
			type: DataTypes.STRING,
			allowNull: true
		},
		initial_eta: {
			type: DataTypes.DATE,
			allowNull: true
		},
		project_ticket_type: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		jira_assignee: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_assignee_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		incentive_points: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "index_ticket",
		timestamps: true,
		paranoid: true,
		createdAt: false,
		updatedAt: false,
		deletedAt: "deleted_at"
	});

	IndexTicket.belongsTo(projectUser, { as: "projectuser", foreignKey: "assigned_to" });
	IndexTicket.belongsTo(TicketStatus, { as: "ticketStatus", foreignKey: "status" });
	IndexTicket.hasMany(Activity, { as: "activity", foreignKey: "ticket_internal_id" });

	return IndexTicket;
};
