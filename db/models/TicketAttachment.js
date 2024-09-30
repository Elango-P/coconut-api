module.exports = (sequelize, DataTypes) =>
	sequelize.define("TicketAttachment", {
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
		page_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		platform: {
			type: DataTypes.STRING,
			allowNull: true
		},
		summary: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		media_name: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "ticket_attachment",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: false
	});
