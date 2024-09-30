module.exports = (sequelize, DataTypes) =>
	sequelize.define("SystemSetting", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		value: {
			type: DataTypes.STRING,
			allowNull: true
		},
	}, {
		tableName: "system_setting",
		timestamps: false
	});
