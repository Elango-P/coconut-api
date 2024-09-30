module.exports = (sequelize, DataTypes) => {
	const ProjectPriority = sequelize.define("ProjectPriority", {
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
		name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		jira_priority_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		jira_priority_name: {
			type: DataTypes.STRING,
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
		tableName: "project_priority",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	return ProjectPriority;
};
