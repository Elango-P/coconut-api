module.exports = (sequelize, DataTypes) => {
	const Ticket = require("./Ticket")(sequelize, DataTypes);
	const TicketTestResultAttachment = require("./TicketTestResultAttachment")(sequelize, DataTypes);

	const TicketTestResult = sequelize.define("TicketTestResult", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		test_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		platform: {
			type: DataTypes.STRING,
			allowNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		reported_ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		sort: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: "0"
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "ticket_test_result",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: false
	});

	TicketTestResult.belongsTo(Ticket, { as: "ticket", foreignKey: "reported_ticket_id" });
	TicketTestResult.hasMany(TicketTestResultAttachment, { as: "ticketTestResultAttachment", foreignKey: "test_result_id", primaryKey: "test_result_id" });

	return TicketTestResult;
};
