module.exports = (sequelize, DataTypes) =>
	sequelize.define("TicketComponent", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		sort: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "ticket_component",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: false
	});
