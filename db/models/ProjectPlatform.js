
module.exports = (sequelize, DataTypes) => {
	const projectPlatform = sequelize.define("project_platform", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        platform_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
	}, {
		tableName: "project_platform",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

	return projectPlatform;
};

