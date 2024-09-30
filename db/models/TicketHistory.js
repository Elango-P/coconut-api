module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);
	const IndexTicket = require("./IndexTicket")(sequelize, DataTypes);

	const TicketHistory = sequelize.define("TicketHistory", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		field: {
			type: DataTypes.STRING,
			allowNull: true
		},
		original_value: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		new_value: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		comments: {
			type: DataTypes.STRING,
			allowNull: false
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "ticket_history",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: false
	});

	TicketHistory.belongsTo(User, { as: "user", foreignKey: "created_by" });
	TicketHistory.belongsTo(IndexTicket, { as: "indexTicket", foreignKey: "ticket_id" });

	return TicketHistory;
};
