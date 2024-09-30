module.exports = (sequelize, DataTypes) =>
	sequelize.define("Permission", {
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
		display_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		feature_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "permission",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});
