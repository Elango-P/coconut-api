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
		summary: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		assignee_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		eta: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		delivery_date: {
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
			allowNull: true,
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
	};

	const ticket = sequelize.define(
		"ticket",
		ticketSchema,
		{
			sequelize,
			tableName: "ticket",
			timestamps: true,
			createdAt: "createdAt",
			updatedAt: "updatedAt",
			deletedAt: "deletedAt",
			paranoid: true,
		}
	);

	// user Association
	ticket.belongsTo(User, {
		as: "assignee",
		foreignKey: "assignee_id",
		targetKey: "id",
	});
	ticket.belongsTo(User, {
		as: "reviewerDetail",
		foreignKey: "reviewer",
		targetKey: "id",
	});

	ticket.belongsTo(User, {
		as: "reporter",
		foreignKey: "reporter_id",
		targetKey: "id",
	});

	ticket.belongsTo(Project, {
		as: "projectDetail",
		foreignKey: "project_id",
		sourceKey: "id",
	});

	ticket.belongsTo(Status, {
		as: "statusDetail",
		foreignKey: "status",
		sourceKey: "id",
	});
	ticket.belongsTo(User, {
		as: "reviewers",
		foreignKey: "reviewer",
		targetKey: "id",
	});
	ticket.belongsTo(ProjectTicketType, {
		as: "ticketTypedetail",
		foreignKey: "type_id",

	});
	ticket.belongsTo(ProjectComponent, {
		as: "projectComponentDetail",
		foreignKey: "component_id",

	});
	ticket.belongsTo(User, {
		as: "developerDetail",
		foreignKey: "developer_id",
		targetKey: "id",
	});
	ticket.belongsTo(User, {
		as: "testerDetail",
		foreignKey: "tester_id",
		targetKey: "id",
	});
	return ticket;
};

