module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);

	const systeLogSchema = {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		object_name: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		object_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
	};

	const History = sequelize.define(
		"History",
		systeLogSchema,
		{
			sequelize,
			tableName: "history",
			timestamps: true,
			createdAt: "createdAt",
			updatedAt: "updatedAt",
			deletedAt: "deletedAt"
		}
	);

	// Store product media Association
	History.belongsTo(User, {
		as: "User",
		foreignKey: "user_id",
		targetKey: "id",
	});

	return History;
};

