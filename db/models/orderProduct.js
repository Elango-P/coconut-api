module.exports = (sequelize, DataTypes) => {
  const location = require("./Location")(sequelize, DataTypes);
  const productIndex = require("./productIndex")(sequelize, DataTypes);
  const status = require("./status")(sequelize, DataTypes);
  const product = require("./product")(sequelize, DataTypes);
  const order = require("./order")(sequelize, DataTypes);

  const orderProductSchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_date: {
			allowNull: true,
			type: DataTypes.DATE,
		},
    cost_price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    profit_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    mrp: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    cgst_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    cgst_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    sgst_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    sgst_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    taxable_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    order_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reward: {
      type: DataTypes.INTEGER,
      allowNull: true,
  },

manual_price: {
  type: DataTypes.DECIMAL,
  allowNull: true,
},
reason: {
  type: DataTypes.STRING,
  allowNull: true,
},
  };

  const orderProduct = sequelize.define("order_product", orderProductSchema, {
    tableName: "order_product",
    paranoid: true,
    sequelize,
    freezeTableName: true,
    timestamps: true,
  });
  orderProduct.belongsTo(location, {
    as: "locationDetails",
    foreignKey: "store_id",
  });
  orderProduct.belongsTo(order, {
    as: "orderDetail",
    foreignKey: "order_id",
  });
  orderProduct.belongsTo(productIndex, {
    as: "productIndex",
    foreignKey: "product_id",
    targetKey: "product_id",
  });
  orderProduct.belongsTo(status, {
    as: "statusDetail",
    foreignKey: "status",
    targetKey: "id",
  });

  orderProduct.belongsTo(product, {
    as: "productDetail",
    foreignKey: "product_id",
    targetKey: "id",
  });

  return orderProduct;
};
