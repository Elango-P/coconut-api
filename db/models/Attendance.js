module.exports = (sequelize, DataTypes) => {
	const location = require("./Location")(sequelize, DataTypes);
	const shift = require("./Shift")(sequelize, DataTypes);
	const User = require("./User")(sequelize, DataTypes);
	const UserIndex = require("./UserIndex")(sequelize, DataTypes);
	const media = require("./Media")(sequelize, DataTypes);

	const Attendance = sequelize.define("Attendance", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		date: {
			type: DataTypes.DATEONLY,
			allowNull: false
		},
		login: {
			type: DataTypes.DATE,
			allowNull: true
		},
		logout: {
			type: DataTypes.DATE,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		worked_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		not_worked_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		productive_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		non_productive_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		late_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		additional_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		late_hours_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		ip_address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		is_leave: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		leave_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		productive_cost: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		non_productive_cost: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		activity_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		lop_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		store_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		shift_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		tracker_attendance_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		check_in_media_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		allow_early_checkout: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		days_count: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		allow_goal_missing: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		approve_late_check_in: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
	}, {
		tableName: "attendance",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		paranoid: true,
	});

	Attendance.belongsTo(User, { as: "user", foreignKey: "user_id" });

	Attendance.belongsTo(shift, {
		as: "shift", 
		foreignKey: "shift_id"
	})
	Attendance.belongsTo(location, {
		as: "location",
		foreignKey: "store_id"
	})
	Attendance.belongsTo(media, {
        as: "media",
        foreignKey: "check_in_media_id",
    });

	Attendance.belongsTo(UserIndex, { as: "userIndex", foreignKey: "user_id", targetKey: "user_id", });

	return Attendance;
};
