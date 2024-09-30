module.exports = (sequelize, DataTypes) =>
	sequelize.define("tag_type", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "tag_type",
		timestamps: true,
        createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt",
		paranoid: true,
	});