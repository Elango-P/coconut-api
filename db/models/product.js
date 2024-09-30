module.exports = (sequelize, DataTypes) => {
  const productTag = require("./productTag")(sequelize, DataTypes);
  const productCategory = require("./productCategory")(sequelize, DataTypes);
  const productBrand = require("./productBrand")(sequelize, DataTypes);
  const location = require("./Location")(sequelize, DataTypes);
  // const vendorProduct = require("./vendorProduct")(sequelize, DataTypes);
  const productIndex = require("./productIndex")(sequelize, DataTypes);
  const productPrice = require("./ProductPrice")(sequelize, DataTypes);

  const productSchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vendor_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rack_number: {
      type: DataTypes.STRING,
      allowNull: true,
  },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    max_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    min_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    taxable: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shopify_product_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    tax_percentage: {
      type: DataTypes.DECIMAL,
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

    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shopify_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shopify_out_of_stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shopify_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    seo_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seo_keyword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seo_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    allow_transfer_out_of_stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    allow_sell_out_of_stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    allow_online_sale: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hsn_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pack_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shelf_life: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    track_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    print_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    igst_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    min_stock_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    max_stock_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discount_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    margin_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    reward: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  };

  const product = sequelize.define("product", productSchema, {
    tableName: "product",
    sequelize,
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  });


  product.hasMany(productTag, {
    as: "productTag",
    foreignKey: "product_id",
  });

  product.belongsTo(productCategory, {
    as: "productCategory",
    foreignKey: "category_id",
  });

  product.belongsTo(productBrand, {
    as: "productBrand",
    foreignKey: "brand_id",
  });

  product.hasMany(productIndex, {
    as: "productIndexDetail",
    foreignKey: "product_id",
  });

  product.hasOne(productPrice, {
    as: "priceDetail",
    foreignKey: "product_id",
  });

  return product;
};
