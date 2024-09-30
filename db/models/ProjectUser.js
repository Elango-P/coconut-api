module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);
	const Project = require("./Project")(sequelize, DataTypes);
	const JiraAuth = require("./JiraAuth")(sequelize, DataTypes);
    const UserRole =require("././UserRole") (sequelize, DataTypes);
	const ProjectUser = sequelize.define("ProjectUser", {
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
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		jira_user: {
			type: DataTypes.STRING,
			allowNull: true
		},
		role: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		jira_auth: {
			type: DataTypes.STRING,
			allowNull: true
		},
		trello_auth: {
			type: DataTypes.STRING,
			allowNull: true
		},
		trello_user: {
			type: DataTypes.STRING,
			allowNull: true
		},
		primary_user: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		jira_auth_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		create_jira: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		update_jira: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		allow_to_view_others_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "project_user",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	ProjectUser.belongsTo(User, { as: "user", foreignKey: "user_id" });
	ProjectUser.belongsTo(Project, { as: "projectDetail", foreignKey: "project_id" });

  
	return ProjectUser;
};
