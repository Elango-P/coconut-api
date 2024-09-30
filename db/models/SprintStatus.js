module.exports = (sequelize, DataTypes) =>
	sequelize.define("SprintStatus", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},

	}, {
		tableName: "sprint_status"
	});
