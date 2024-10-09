
module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);
	const Project = require("./Project")(sequelize, DataTypes);
	const Status = require("./status")(sequelize, DataTypes);
	const ProjectTicketType = require("./ProjectTicketType")(sequelize, DataTypes);
	const ProjectComponent = require("./ProjectComponent")(sequelize, DataTypes);

	const ticketSchema = {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		summary: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		assignee_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		due_date: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		ticket_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		reporter_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		sprint: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		project_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		type_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		component_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		severity_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		priority: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		acceptance_criteria: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		environment: {
			type: DataTypes.TEXT,
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
		story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		reviewer: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		completed_at: {
			type: DataTypes.DATE,
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
		status_group_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		recurring_task_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		parent_ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		developer_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		tester_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		ticket_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		initial_eta: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		from_location: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		to_location: {
			type: DataTypes.TEXT,
			allowNull: true
		},
	};
	const TicketIndex = sequelize.define("ticket_index", ticketSchema, {
		tableName: "ticket_index",
		sequelize,
		freezeTableName: true,
		timestamps: true,
	});

	// user Association
	TicketIndex.belongsTo(User, {
		as: "assignee",
		foreignKey: "assignee_id",
		targetKey: "id",
	});
	TicketIndex.belongsTo(User, {
		as: "reviewerDetail",
		foreignKey: "reviewer",
		targetKey: "id",
	});
	TicketIndex.belongsTo(User, {
		as: "reporter",
		foreignKey: "reporter_id",
		targetKey: "id",
	});

	TicketIndex.belongsTo(Project, {
		as: "projectDetail",
		foreignKey: "project_id",
		sourceKey: "id",
	});
	TicketIndex.belongsTo(Status, {
		as: "statusDetail",
		foreignKey: "status",
		sourceKey: "id",
	});

	TicketIndex.belongsTo(ProjectTicketType, {
		as: "ticketTypedetail",
		foreignKey: "type_id",
		sourceKey: "id",
	});
	TicketIndex.belongsTo(ProjectComponent, {
		as: "projectComponentDetail",
		foreignKey: "component_id",
		sourceKey: "id",
	});
	TicketIndex.belongsTo(User, {
		as: "developerDetail",
		foreignKey: "developer_id",
		targetKey: "id",
	});
	TicketIndex.belongsTo(User, {
		as: "testerDetail",
		foreignKey: "tester_id",
		targetKey: "id",
	});

	return TicketIndex;
};

