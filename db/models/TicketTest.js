module.exports = (sequelize, DataTypes) => {
	const TicketTestResult = require("./TicketTestResult")(sequelize, DataTypes);

	const TicketTest = sequelize.define("TicketTest", {
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
		test_master_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		summary: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		feature: {
			type: DataTypes.STRING,
			allowNull: true
		},
		feature_action: {
			type: DataTypes.STRING,
			allowNull: true
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		priority: {
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
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		action_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		system_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		imported_at: {
			type: DataTypes.DATE,
			allowNull: true
		},
		excluded: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
		result: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		test_number: {
			type: DataTypes.STRING,
			allowNull: true
		},
	}, {
		tableName: "ticket_test",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	TicketTest.hasMany(TicketTestResult, { as: "ticketTestResult", foreignKey: "test_id", primaryKey: "test_id" });

	return TicketTest;
};

