module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);

	const JiraAuth = sequelize.define("JiraAuth", {
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
		email:  {
			type: DataTypes.STRING,
			allowNull: true
		},
		api_token: {
			type: DataTypes.STRING,
			allowNull: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		jira_account_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_user_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_display_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
	}, {
		tableName: "jira_auth",
		timestamps: false
	});

	JiraAuth.belongsTo(User, { as: "user", foreignKey: "user_id" });

	return JiraAuth;
};
