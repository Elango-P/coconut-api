module.exports = (sequelize, DataTypes) => {
	const TicketStatus = require("./TicketStatus")(sequelize, DataTypes);
	const ProjectTicketType = require("./ProjectTicketType")(sequelize, DataTypes);
	

	const ProjectTicketStatusParentRelation = sequelize.define("ProjectTicketStatusParentRelation", {
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
		project_ticket_status_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		sub_task_ticket_types: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		parent_ticket_status_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		sort: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "project_ticket_status_parent_relation",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

	ProjectTicketStatusParentRelation.belongsTo(TicketStatus, { as: "ticketStatus", foreignKey: "project_ticket_status_id" });
	ProjectTicketStatusParentRelation.belongsTo(TicketStatus, { as: "parentProjectTicketStatus", foreignKey: "parent_ticket_status_id" });
	ProjectTicketStatusParentRelation.belongsTo(ProjectTicketType, { as: "parentProjectTicketType", foreignKey: "parent_ticket_type" });

	return ProjectTicketStatusParentRelation;
};
