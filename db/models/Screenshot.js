module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);
	const Screenshot = sequelize.define("Screenshot", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		image: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ip_address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		system_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		version: {
			type: DataTypes.STRING,
			allowNull: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: "screenshot",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: false,
		paranoid: true,
	});

	Screenshot.belongsTo(User, { as: "user", foreignKey: "user_id" });

	return Screenshot;
};
