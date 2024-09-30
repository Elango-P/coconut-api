module.exports = (sequelize, DataTypes) => {
	const ProjectUser = require("./ProjectUser")(sequelize, DataTypes);

	const IndexProject = sequelize.define("IndexProject", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false
		},
		slug: {
			type: DataTypes.STRING,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		user: {
			type: DataTypes.STRING,
			allowNull: true
		},
		last_ticket_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		sort: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: 0.00
		},
		allow_manual_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		component: {
			type: DataTypes.STRING,
			allowNull: true
		},
		repository: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_host: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_project_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		jira_board_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		update_jira: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		status_text: {
			type: DataTypes.STRING,
			allowNull: false
		},
		users: {
			type: DataTypes.JSON,
			allowNull: true
		},
		releases: {
			type: DataTypes.JSON,
			allowNull: true
		},
		sprints: {
			type: DataTypes.JSON,
			allowNull: true
		},
		trello_board_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		trello_board_list_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		slack_webhook_key: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_auths: {
			type: DataTypes.JSON,
			allowNull: true
		},
		delivery_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		jira_auth_type: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "index_project",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: false
	});

	IndexProject.belongsTo(ProjectUser, { as: "projectUser", foreignKey: "id", targetKey: "project_id" });

	return IndexProject;
};
