module.exports = (sequelize, DataTypes) =>
	sequelize.define("UserProfile", {
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		account_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		account_number: {
			type: DataTypes.STRING,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "user_profile",
		timestamps: true,
		createdAt: false,
		updatedAt: "updated_at",
		deletedAt: false
	});
