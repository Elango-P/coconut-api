module.exports = (sequelize, DataTypes) =>
	sequelize.define("Reimbursement", {
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
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		amount: {
			type: DataTypes.STRING,
			allowNull: true
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "reimbursement",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: false
	});
