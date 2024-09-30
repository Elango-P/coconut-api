module.exports = (sequelize, DataTypes) =>
	sequelize.define("ProjectSprint", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		project_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		jira_sprint_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		jira_version_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},

	}, {
		tableName: "project_sprint",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: false
	});
