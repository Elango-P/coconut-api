module.exports = (sequelize, DataTypes) => {
    const product_index = require("./productIndex")(sequelize, DataTypes);
    const purchaseOrder = require("./purchaseOrderModal")(sequelize, DataTypes);
    const status = require("./status")(sequelize, DataTypes);
	const PurchaseOrderProduct = sequelize.define("purchase_order_product", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		purchase_order_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        quantity: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
        unit_price: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
        amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "purchase_order_product",
		timestamps: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt"
	});
	PurchaseOrderProduct.hasOne(product_index, {
		as: "productDetails",
		sourceKey: "product_id",
		foreignKey: "product_id",
	});
	PurchaseOrderProduct.belongsTo(status, {
		as: "statusDetail",
		foreignKey: "status",
	});
	PurchaseOrderProduct.hasOne(purchaseOrder, {
		as: "purchaseOrder",
		sourceKey: "purchase_order_id",
		foreignKey: "id",
	});
	return PurchaseOrderProduct;
};
