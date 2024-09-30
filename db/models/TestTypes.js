module.exports = (sequelize, DataTypes) =>
	sequelize.define("TestTypes", {
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
		sort: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},

	}, {
		tableName: "test_types",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: false
	});
