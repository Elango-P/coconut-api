module.exports = (sequelize, DataTypes) =>
	sequelize.define("ProjectConfig", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		project_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		key: {
			type: DataTypes.STRING,
			allowNull: false
		},
		value: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "project_config",
		timestamps: false
	});
