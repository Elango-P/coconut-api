
module.exports = (sequelize, DataTypes) => {
	const Project = require("./Project")(sequelize, DataTypes);
	const User = require("./User")(sequelize, DataTypes);
	const TestSuiteLink = require("./TestSuiteLink")(sequelize, DataTypes);
	const TestCaseLabel = require("./TestCaseLabel")(sequelize, DataTypes);
    const Tag = require("./Tag")(sequelize, DataTypes);


	const TicketTestCase = sequelize.define("TicketTestCase", {
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
		summary: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		module: {
			type: DataTypes.STRING,
			allowNull: true
		},
		feature: {
			type: DataTypes.STRING,
			allowNull: true
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		priority: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		labels: {
			type: DataTypes.STRING,
			allowNull: true
		},
		automation_test_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		test_steps: {
			type: DataTypes.JSON,
			allowNull: true
		},
		sort: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
		module_tag_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
		name : {
			type: DataTypes.STRING,  
			allowNull: true
		},
		description : {
			type: DataTypes.STRING,  
			allowNull: true
		},
		prerequisite : {
			type: DataTypes.STRING,  
			allowNull: true
		},
		test_data : {
			type: DataTypes.STRING,  
			allowNull: true
		},
		expected_result : {
			type: DataTypes.STRING,  
			allowNull: true
		},
		comments : {
			type: DataTypes.TEXT,  
			allowNull: true
		},
		test_case_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "ticket_test_case",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	TicketTestCase.belongsTo(Project, { as: "project", foreignKey: "project_id" });
	TicketTestCase.belongsTo(User, { as: "user", foreignKey: "user_id" });
	TicketTestCase.hasMany(TestSuiteLink, { as: "testSuiteLink", foreignKey: "test_id", primaryKey: "test_id" });
	TicketTestCase.hasMany(TestCaseLabel, { as: "testCaseLabel", foreignKey: "test_case_id", primaryKey: "test_case_id" });
	TicketTestCase.belongsTo(TestSuiteLink, { as: "testSuiteLinkSearch", foreignKey: "id", targetKey: "test_id" });
	TicketTestCase.belongsTo(Tag, { as: "tagDetail", foreignKey: "module_tag_id" });

	return TicketTestCase;
};
