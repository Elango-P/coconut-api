module.exports = (sequelize, DataTypes) =>
	sequelize.define("TestCaseLabel", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		test_case_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		label_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		label: {
			type: DataTypes.STRING,
			allowNull: true
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "test_case_label",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});
