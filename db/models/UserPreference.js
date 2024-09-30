module.exports = (sequelize, DataTypes) =>
	sequelize.define("UserPreference", {
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
		key: {
			type: DataTypes.STRING,
			allowNull: false
		},
		value: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},

	}, {
		tableName: "user_preference",
		timestamps: false
	});
