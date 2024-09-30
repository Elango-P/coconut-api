module.exports = (sequelize, DataTypes) => {
  const StoreProduct = require('./storeProduct')(sequelize, DataTypes);
  const StockEntry = require('./StockEntry')(sequelize, DataTypes);
  const product_index = require('./productIndex')(sequelize, DataTypes);
  const status = require("./status")(sequelize, DataTypes);
  const User = require("./User")(sequelize, DataTypes);
  const Location = require("./Location")(sequelize, DataTypes);
  const StockEntryProductSchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    stock_entry_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    store_product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    system_quantity: {
      type: DataTypes.INTEGER,
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
    owner_id: {
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
    shift_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  };

  const StockEntryProduct = sequelize.define('stock_entry_product', StockEntryProductSchema, {
    tableName: 'stock_entry_product',
    sequelize,
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
  });

  StockEntryProduct.belongsTo(StoreProduct, {
    as: 'storeProductDetail',
    foreignKey: 'product_id',
  });
  StockEntryProduct.belongsTo(StockEntry, {
    as: 'stockEntryDetail',
    foreignKey: 'stock_entry_id',
  });

  StockEntryProduct.belongsTo(product_index, {
    as: 'productIndexList',
    foreignKey: 'product_id',
    targetKey: 'product_id',
  });
  StockEntryProduct.belongsTo(status, {
    as: "statusDetail",
    foreignKey: "status"
  });
  StockEntryProduct.belongsTo(User, {
    as: "user",
    foreignKey: "owner_id"
  })
  StockEntryProduct.belongsTo(Location, {
    as: "location",
    foreignKey: "store_id"
  })
  return StockEntryProduct;
};
