module.exports = (sequelize, DataTypes) => {
	const ProjectTicketType = require("./ProjectTicketType")(sequelize, DataTypes);
	const ProjectTicketTypeRelation = sequelize.define("ProjectTicketTypeRelation", {
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
		project_ticket_type_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		project_child_ticket_type_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "project_ticket_type_relation",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

	ProjectTicketTypeRelation.belongsTo(ProjectTicketType, { as: "parentProjectTicketType", foreignKey: "project_ticket_type_id" });
	ProjectTicketTypeRelation.belongsTo(ProjectTicketType, { as: "childProjectTicketType", foreignKey: "project_child_ticket_type_id" });

	return ProjectTicketTypeRelation;
};
