module.exports = (sequelize, DataTypes) => {
  const location = require("./Location")(sequelize, DataTypes);
  const productIndex = require("./productIndex")(sequelize, DataTypes);
  const status = require("./status")(sequelize, DataTypes);
  const product = require("./product")(sequelize, DataTypes);
  const invoiceModel = require("./InvoiceModel")(
    sequelize,
    DataTypes
  );

  const schema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
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
   
    unit_price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    invoice_date: {
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
    invoice_number: {
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
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    manual_price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    order_product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  };

  const invoiceProduct = sequelize.define(
    "invoice_product",
    schema,
    {
      tableName: "invoice_product",
      paranoid: true,
      sequelize,
      freezeTableName: true,
      timestamps: true,
    }
  );
  invoiceProduct.belongsTo(location, {
    as: "locationDetails",
    foreignKey: "store_id",
  });
  invoiceProduct.belongsTo(invoiceModel, {
    as: "invoiceDetail",
    foreignKey: "invoice_id",
  });
  invoiceProduct.belongsTo(productIndex, {
    as: "productIndex",
    foreignKey: "product_id",
    targetKey: "product_id",
  });
  invoiceProduct.belongsTo(status, {
    as: "statusDetail",
    foreignKey: "status",
    targetKey: "id",
  });

  invoiceProduct.belongsTo(product, {
    as: "productDetail",
    foreignKey: "product_id",
    targetKey: "id",
  });

  return invoiceProduct;
};
