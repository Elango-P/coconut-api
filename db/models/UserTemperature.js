module.exports = (sequelize, DataTypes) => {
	const UserTemperature = sequelize.define("user_temperature", {
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
		date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		temperature: {
			type: DataTypes.STRING,
			allowNull: true
		},
		image: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},

	}, {
		tableName: "user_temperature",
		timestamps: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

	return UserTemperature;
};
