module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);
	const Ticket = require("./Ticket")(sequelize, DataTypes);
	const ActivityType = require("./ActivityType")(sequelize, DataTypes);

	const TicketTask = sequelize.define("TicketTask", {
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
		summary: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		sort: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		system_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		estimated_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "ticket_task",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	TicketTask.belongsTo(User, { as: "user", foreignKey: "user_id" });
	TicketTask.belongsTo(Ticket, { as: "ticket", foreignKey: "ticket_id" });
	TicketTask.belongsTo(ActivityType, { as: "activityType", foreignKey: "type" });

	return TicketTask;
};
