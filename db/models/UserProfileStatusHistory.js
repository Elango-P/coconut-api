module.exports = (sequelize, DataTypes) =>
	sequelize.define("UserProfileStatusHistory", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		user_profile_status_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "user_profile_status_history",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: false
	});
