module.exports = (sequelize, DataTypes) => {
    
    const product_index = require("./productIndex")(sequelize, DataTypes);

    const location = require("./Location")(sequelize, DataTypes);

    const storeProductOutOfStockSchema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        date: {
            allowNull: true,
            type: DataTypes.DATEONLY
        },
        product_id: {
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
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        record_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    };
    const StoreProductOutOfStock = sequelize.define("store_product_out_of_stock", storeProductOutOfStockSchema, {
        tableName: "store_product_out_of_stock",
        sequelize,
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    });

    StoreProductOutOfStock.hasOne(product_index, {
        as: "productIndex",
        sourceKey: "product_id",
        foreignKey: "product_id",
    });

    StoreProductOutOfStock.hasOne(location, {
        as: "locationDetail",
        sourceKey: "store_id",
        foreignKey: "id",
    });

    return StoreProductOutOfStock
}