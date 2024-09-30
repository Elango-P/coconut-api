module.exports = (sequelize, DataTypes) =>
	sequelize.define("UserConfig", {
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
		name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		value: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},

	}, {
		tableName: "user_config",
		timestamps: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: false
	});
