const { INTEGER } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const StoreProduct = require('./storeProduct')(sequelize, DataTypes);
  const purchase = require('./Purchase')(sequelize, DataTypes);
  const productIndex = require('./productIndex')(sequelize, DataTypes);
	const status = require("./status")(sequelize, DataTypes);
	const account = require("./account")(sequelize, DataTypes);

  const BillProductSchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    purchase_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    discount_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    tax_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    tax_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    net_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    taxable_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    cgst_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    sgst_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    cess_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    cgst_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    sgst_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    cess_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    igst_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    igst_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    mrp: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    unit_margin_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    margin_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    manufactured_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    mrp: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    margin_percentage: {
      type: DataTypes.NUMERIC,
      allowNull: true,
    },
    cost_price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    discount_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  };

  const PurchaseProduct = sequelize.define('purchase_product', BillProductSchema, {
    tableName: 'purchase_product',
    sequelize,
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
  });

  PurchaseProduct.belongsTo(StoreProduct, {
    as: 'storeProductDetail',
    foreignKey: 'product_id',
  });
  PurchaseProduct.belongsTo(purchase, {
    as: 'purchaseDetail',
    foreignKey: 'purchase_id',
  });
  PurchaseProduct.belongsTo(productIndex, {
    as: 'productIndex',
    foreignKey: 'product_id',
    targetKey: 'product_id',
  });
  PurchaseProduct.belongsTo(status, {
		as: "statusDetail",
		foreignKey: "status"
	})
  PurchaseProduct.belongsTo(account, {
		as: "account",
		foreignKey: "vendor_id"
	})
  return PurchaseProduct;
};
