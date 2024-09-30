module.exports = (sequelize, DataTypes) =>
	sequelize.define("TestSuiteLabel", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		test_suite_id: {
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
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
	}, {
		tableName: "test_suite_label",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});
