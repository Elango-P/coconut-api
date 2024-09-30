module.exports = (sequelize, DataTypes) =>
	sequelize.define("AccountCategory", {
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
		status: {
			type: DataTypes.INTEGER,
			allowNull: false
	  },
	  company_id : {
		  type: DataTypes.INTEGER,
		  allowNull: true
	  },

	}, {
		tableName: "account_category",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});
