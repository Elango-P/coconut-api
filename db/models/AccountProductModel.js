
module.exports = (sequelize, DataTypes) => {
  const productIndex = require("./productIndex")(sequelize, DataTypes);
  const account = require("./account")(sequelize, DataTypes);

  const accountProductSchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
     margin_percentage: {
      type: DataTypes.NUMERIC,
      allowNull: true,
    }
  };

  const accountProduct = sequelize.define("account_product", accountProductSchema, {
    tableName: "account_product",
    sequelize,
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  });
  accountProduct.belongsTo(productIndex, {
    as: "productIndex",
    foreignKey: "product_id",
    targetKey: "product_id",
  });
  accountProduct.belongsTo(account, {
    as: 'accountDetail',
    foreignKey: 'account_id'
  });

  return accountProduct;
};
