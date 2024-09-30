module.exports = (sequelize, DataTypes) => {
  const syncSchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    shopify_store_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shopify_admin_api_version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shopify_api_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shopify_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    allowed_shift: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address1: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pin_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_number1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_number2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    allow_sale: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    featured_media_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    minimum_cash_in_store: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    cash_in_location: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    distribution_center: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    print_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    allow_replenishment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    allow_purchase: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_order_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sales_settlement_required: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    open_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    close_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
  },
  allow_check_in: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  };

  const sync = sequelize.define("store", syncSchema, {
    tableName: "store",
    sequelize,
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  });

  return sync;
};
