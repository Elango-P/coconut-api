module.exports = (sequelize, DataTypes) =>
	sequelize.define("LeaveCreditHistory", {
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
		month: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		number_of_days: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "leave_credit_history",
		timestamps: true,
		createdAt: "created_at",
		deletedAt: false
	});
