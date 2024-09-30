module.exports = (sequelize, DataTypes) => {
  const location = require("./Location")(sequelize, DataTypes);
  const User = require("./User")(sequelize, DataTypes);
  const shift = require("./Shift")(sequelize, DataTypes);
  const status = require("./status")(sequelize, DataTypes);
  const schema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    invoice_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.NUMERIC,
      allowNull: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customer_account: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
   
    sales_executive_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    delivery_executive: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shift: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    customer_phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
    },
    payment_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_cgst_amount: {
      type: DataTypes.NUMERIC,
      allowNull: true,
    },
    total_sgst_amount: {
      type: DataTypes.NUMERIC,
      allowNull: true,
    },
    cash_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    upi_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const invoice = sequelize.define("invoice", schema, {
    sequelize,
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  });

  invoice.belongsTo(location, {
    as: "location",
    foreignKey: "store_id",
  });

  invoice.belongsTo(User, {
    as: "salesExecutive",
    foreignKey: "sales_executive_user_id",
  });
  invoice.belongsTo(User, {
    as: "user",
    foreignKey: "createdBy",
  });
  invoice.belongsTo(shift, {
    as: "shiftDetail",
    foreignKey: "shift",
  });
  invoice.belongsTo(status, {
    as: "statusDetail",
    foreignKey: "status",
  });
  return invoice;
};
