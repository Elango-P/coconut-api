module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);

	const Message = sequelize.define("message", {
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
		message: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		object_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		channel_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		object_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		reciever_user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		read_at: {
			allowNull: true,
			type: DataTypes.DATE,
		},



	}, {
		tableName: "message",
		timestamps: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt",

		paranoid: true,
	});
	Message.belongsTo(User, {
		as: "sender",
		foreignKey: "user_id",
	});
	Message.belongsTo(User, {
		as: "reciever",
		foreignKey: "reciever_user_id",
	});
	return Message;
}
