module.exports = (sequelize, DataTypes) => {
	const TicketStatus = require("./TicketStatus")(sequelize, DataTypes);
	const ProjectTicketType = require("./ProjectTicketType")(sequelize, DataTypes);
	const User = require("./User")(sequelize, DataTypes);

	const ProjectStatus = sequelize.define("ProjectStatus", {
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
		status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		jira_status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		jira_status_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		primary_assignee: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		sort: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "project_status",
		timestamps: true,
		updatedAt: false,
		createdAt: "created_at"
	});

	ProjectStatus.belongsTo(TicketStatus, { as: "ticketStatus", foreignKey: "status" });
	ProjectStatus.belongsTo(ProjectTicketType, { as: "projectTicketType", foreignKey: "type" });
	ProjectStatus.belongsTo(User, { as: "primaryAssignee", foreignKey: "primary_assignee" });
	return ProjectStatus;
};
