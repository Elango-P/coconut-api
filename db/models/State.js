module.exports = (sequelize, DataTypes) =>
	sequelize.define("State", {
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
		country_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "state",
		paranoid: true,
	});
