module.exports = (sequelize, DataTypes) => {
	const AccountBill = require("./Purchase")(sequelize, DataTypes);
	const Media = require("./Media")(sequelize, DataTypes);

	const BillMedia = sequelize.define("bill_media", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		bill_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
        media_id: {
            type: DataTypes.INTEGER,
			allowNull: true
        }
	}, {
		tableName: "bill_media",
		timestamps: true,
		paranoid: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

	BillMedia.belongsTo(AccountBill, {
		as: "bill_media",
		foreignKey: "bill_id"
	})

	BillMedia.belongsTo(Media, {
		as: "media",
		foreignKey: "media_id",
	});

	return BillMedia;
};
