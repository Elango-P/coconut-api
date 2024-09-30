module.exports = (sequelize, DataTypes) =>
	sequelize.define("UserProfileStatus", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		profile_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		sort: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		status_type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "user_profile_status",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});
