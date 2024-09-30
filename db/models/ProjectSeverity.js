module.exports = (sequelize, DataTypes) => {
	const ProjectSeverity = sequelize.define("ProjectSeverity", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		project_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		severity: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_severity_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		jira_severity_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_severity_field: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		sort: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "project_severity",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	return ProjectSeverity;
};
