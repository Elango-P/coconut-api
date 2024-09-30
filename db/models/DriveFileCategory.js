module.exports = (sequelize, DataTypes) =>
	sequelize.define("drive_file_category", {
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
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "drive_file_category",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: "deleted_at"
	});
