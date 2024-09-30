module.exports = (sequelize, DataTypes) =>
	sequelize.define("UserPermission", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		permission_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		display_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
		created_by: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: "user_permission",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});
