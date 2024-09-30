module.exports = (sequelize, DataTypes) => {
	const Category = require("./DriveFileCategory")(sequelize, DataTypes);
	const User = require("./User")(sequelize, DataTypes);

	const Drive = sequelize.define("Drive", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		category_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		owner_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		media_name: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
		updated_by: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: "drive",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	Drive.belongsTo(Category, { as: "drive_file_category", foreignKey: "category_id" });
	Drive.belongsTo(User, { as: "user", foreignKey: "updated_by" });
	Drive.belongsTo(User, { as: "driveOwner", foreignKey: "owner_id" });
	return Drive;
};
