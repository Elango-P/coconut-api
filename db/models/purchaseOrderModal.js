module.exports = (sequelize, DataTypes) => {
	const account = require("./account")(sequelize, DataTypes);
	const status = require("./status")(sequelize, DataTypes);
    const User = require("./User")(sequelize, DataTypes);

	const PurchaseOrder = sequelize.define("purchase_order", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		purchase_order_number: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		vendor_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		delivery_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		owner_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		billing_address_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		delivery_address_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
	}, {
		tableName: "purchase_order",
		timestamps: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});

	PurchaseOrder.belongsTo(account, {
		as: "account",
		foreignKey: "vendor_id"
	})
	PurchaseOrder.belongsTo(status, {
		as: "statusDetail",
		foreignKey: "status"
	})
	PurchaseOrder.belongsTo(User, {
		as: "userDetail",
		foreignKey: ("owner_id"),
	})

	return PurchaseOrder;
};
