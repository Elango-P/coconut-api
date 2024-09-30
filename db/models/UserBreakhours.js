module.exports = (sequelize, DataTypes) =>
	sequelize.define("UserBreakhours", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
        break_hour_start_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		break_hour_end_time: {
			type: DataTypes.TIME,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "user_breakhours",
		timestamps: true,
        createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});