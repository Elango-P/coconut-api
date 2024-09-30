module.exports = (sequelize, DataTypes) =>
	sequelize.define("ReimbursementType", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		amount: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "reimbursement_type"
	});
