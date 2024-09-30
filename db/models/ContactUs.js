module.exports = (sequelize, DataTypes) =>
	sequelize.define("ContactUs", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		subject: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},

	}, {
		tableName: "contact_us",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: false
	});
