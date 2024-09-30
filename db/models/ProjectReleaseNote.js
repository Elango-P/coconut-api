module.exports = (sequelize, DataTypes) =>
	sequelize.define("ProjectReleaseNote", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		release_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "project_release_note",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});
