module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);
	const Ticket = require("./Ticket")(sequelize, DataTypes);
	const ActivityType = require("./ActivityType")(sequelize, DataTypes);
	const Status = require("./status")(sequelize, DataTypes);
	const Location = require("./Location")(sequelize, DataTypes);

	const Activity = sequelize.define("Activity", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		activity: {
			type: DataTypes.STRING,
			allowNull: false
		},
		activity_type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		activity_type_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		actual_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		owner_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		ticket_internal_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		cost: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		ip_address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		approved_by: {
			type: DataTypes.STRING,
			allowNull: true
		},
		approved_at: {
			type: DataTypes.DATE,
			allowNull: true
		},
		explanation: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		estimated_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		model_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		system_hours : {
      type: DataTypes.INTEGER,
		  allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},

		started_at: {
			type: DataTypes.DATE,
			allowNull: true
		},

		completed_at: {
			type: DataTypes.DATE,
			allowNull: true
		},
		location_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
	}, {
		tableName: "activity",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	Activity.belongsTo(User, { as: "user", foreignKey: "owner_id" });
	Activity.belongsTo(Ticket, { as: "ticket", foreignKey: "ticket_internal_id" });
	Activity.belongsTo(ActivityType, { as: "activityType", foreignKey: "activity", targetKey: "name" });
	Activity.belongsTo(ActivityType, { as: "activityUsers", foreignKey: "activity_type_id" });
	Activity.belongsTo(Status, { as: "statusDetail", foreignKey: "status" });
	Activity.belongsTo(Location, { as: "locationDetail", foreignKey: "location_id" });

	return Activity;
};
