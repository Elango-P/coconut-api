module.exports = (sequelize, DataTypes) => {
	const TicketStatus = require("./TicketStatus")(sequelize, DataTypes);

	const ProjectTicketStatusRelation = sequelize.define("ProjectTicketTypeRelation", {
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
		project_ticket_next_status_id: {
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
		tableName: "project_ticket_status_relation",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

	ProjectTicketStatusRelation.belongsTo(TicketStatus, { as: "projectTicketStatus", foreignKey: "project_ticket_status_id" });
	ProjectTicketStatusRelation.belongsTo(TicketStatus, { as: "projectNextTicketStatus", foreignKey: "project_ticket_next_status_id" });

	return ProjectTicketStatusRelation;
};
