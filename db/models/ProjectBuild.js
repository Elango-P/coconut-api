module.exports = (sequelize, DataTypes) => {
	const ProjectEnvironment = require("./ProjectEnvironment")(sequelize, DataTypes);

	const ProjectBuild = sequelize.define("ProjectBuild", {
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
		environment_id: {
			type: DataTypes.INTEGER,
			allowNull: true 
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false,
		},
	}, {
		tableName: "project_build",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	ProjectBuild.belongsTo(ProjectEnvironment, { as: "projectEnvironment", foreignKey: "environment_id" });

	return ProjectBuild;
};
