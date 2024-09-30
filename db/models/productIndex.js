module.exports = (sequelize, DataTypes) => {

    const media = require("./Media")(sequelize, DataTypes);
    const productCategory = require("./productCategory")(sequelize, DataTypes);
    const productBrand = require("./productBrand")(sequelize, DataTypes);
    const productTag = require("./productTag")(sequelize, DataTypes);

    const productSchema = {
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
        product_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        size: {
            type: DataTypes.NUMERIC,
            allowNull: true,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sale_price: {
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        rack_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        hsn_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        product_display_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        brand_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cost: {
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        product_media_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        featured_media_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        max_quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        min_quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        mrp: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        allow_transfer_out_of_stock: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        profit_amount: {
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        profit_percentage: {
            type: DataTypes.DECIMAL,
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
        tax_percentage: {
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        pack_size: {
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
        cgst_percentage:{
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        sgst_percentage:{
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        cgst_amount:{
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        sgst_amount:{
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        product_price_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        last_purchased_cost:{
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        last_purchased_date:{
            type: DataTypes.DATE,
            allowNull: true,
        },
        manufacture_name:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        manufacture_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        discount_percentage:{
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        margin_percentage:{
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        reward: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        shelf_life: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        igst_percentage:{
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        order_quantity:{
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
    };

    const productIndex = sequelize.define("product_index", productSchema, {
        tableName: "product_index",
        sequelize,
        freezeTableName: true,
        timestamps: true,
    });

    // Product Association
    productIndex.belongsTo(media, {
        as: "media",
        foreignKey: "product_id",
        targetKey: "object_id",
    });


    productIndex.belongsTo(productCategory, {
        as: "productCategory",
        foreignKey: "category_id",
    });

    productIndex.belongsTo(productBrand, {
        as: "productBrand",
        foreignKey: "brand_id",
    });
       // Product Association
       productIndex.belongsTo(productTag, {
        as: "productTagDetail",
        foreignKey: "product_id",
    });


    return productIndex;
};