module.exports = (sequelize, DataTypes) =>
	sequelize.define("AttendanceStatus", {
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
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "attendance_status"
	});
