module.exports = (sequelize, DataTypes) =>
	sequelize.define("TicketTypeStatus", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		type_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "ticket_type_status",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: false
	});
