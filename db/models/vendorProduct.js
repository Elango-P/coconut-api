module.exports = (sequelize, DataTypes) => {

    const productCategory = require("./productCategory")(sequelize, DataTypes);
	const productBrand = require("./productBrand")(sequelize, DataTypes);
    const product =  require("./product")(sequelize, DataTypes);
    const account =  require("./account")(sequelize, DataTypes);
    const supplierProductMedia =  require("./supplierProductMedia")(sequelize, DataTypes);
    const product_index = require("./productIndex")(sequelize, DataTypes);

    const vendorProductSchema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        vendor_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        sale_price: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        vendor_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        import_status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        barcode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        imported_at: {
            type: DataTypes.DATE,
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
        company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
    };

    const vendorProduct = sequelize.define(
        "vendor_product",
        vendorProductSchema,
        {
            tableName: "vendor_product",
            sequelize,
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
        }
    );

    // Product Association
        vendorProduct.belongsTo(productCategory, {
            as: "productCategory",
            foreignKey: "category_id",
        });

        vendorProduct.belongsTo(productBrand, {
            as: "productBrand",
            foreignKey: "brand_id",
        });

        vendorProduct.belongsTo(product, {
            as: "product",
            foreignKey: "product_id",
        });
        vendorProduct.hasOne(product_index, {
            as: "productIndex",
            sourceKey: "product_id",
            foreignKey: "product_id",
        });

        vendorProduct.belongsTo(account, {
            as: "account",
            foreignKey: "vendor_id",
        });

        vendorProduct.hasMany(supplierProductMedia, {
            as: "supplierProductImages",
            foreignKey: "supplier_product_id",
        });

    return vendorProduct;
};
