module.exports = (sequelize, DataTypes) =>
sequelize.define("TicketAcceptanceCriteria", {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	ticket_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	acceptance_criteria: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	company_id : {
		type: DataTypes.INTEGER,  
		allowNull: true
	},
}, {
	tableName: "ticket_acceptance_criteria",
	timestamps: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	deletedAt: false
});
