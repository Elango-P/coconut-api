module.exports = (sequelize, DataTypes) => {
	const TestSuite = require("./TestSuite")(sequelize, DataTypes);

	const TestSuiteLink = sequelize.define("TestSuiteLink", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		test_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		suite_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "test_suite_link",
		timestamps: false
	});

	TestSuiteLink.belongsTo(TestSuite, { as: "testSuite", foreignKey: "suite_id" });

	return TestSuiteLink;
};
