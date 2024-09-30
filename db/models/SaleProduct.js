
module.exports = (sequelize, DataTypes) => {

  const storeProduct = require("./storeProduct")(sequelize, DataTypes);
  const productIndex = require("./productIndex")(sequelize, DataTypes);

  const SaleProductSchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    unit_price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    cost_price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    mrp: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },

    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    item: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  };
  const SaleProduct = sequelize.define("sale_product", SaleProductSchema, {
    tableName: "sale_product",
    sequelize,
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
  });

  SaleProduct.belongsTo(storeProduct, {
    as: "storeProductDetail",
    foreignKey: "product_id",
  });

  SaleProduct.belongsTo(productIndex, {
    as: "productIndex",
    foreignKey: "product_id",
    targetKey: "product_id",
});

  return SaleProduct;
};
