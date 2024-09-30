module.exports = (sequelize, DataTypes) => {
	const Project = require("./Project")(sequelize, DataTypes);
	const ProjectComponent = sequelize.define("ProjectComponent", {
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
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
	}, {
		tableName: "project_component",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	ProjectComponent.belongsTo(Project, { as: "projectDetail", foreignKey: "project_id" });


	return ProjectComponent;
};
