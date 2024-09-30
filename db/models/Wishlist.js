module.exports = (sequelize, DataTypes) => {
    
    const product_index = require("./productIndex")(sequelize, DataTypes);

    const location = require("./Location")(sequelize, DataTypes);

    const wishlistSchema = {
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
            allowNull: false,
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
    const wishlist = sequelize.define("wishlist", wishlistSchema, {
        tableName: "wishlist",
        sequelize,
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    });

    wishlist.hasOne(product_index, {
        as: "productIndex",
        sourceKey: "product_id",
        foreignKey: "product_id",
    });

    wishlist.hasOne(location, {
        as: "locationDetail",
        sourceKey: "store_id",
        foreignKey: "id",
    });

    return wishlist
}