module.exports = (sequelize, DataTypes) =>
	sequelize.define("TicketPoa", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		details: {
			type: DataTypes.JSON,
			allowNull: true
		},
		attachments: {
			type: DataTypes.JSON,
			allowNull: true
		},
		updated_by: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "ticket_poa",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});
