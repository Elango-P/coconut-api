module.exports = (sequelize, DataTypes) => {
    const productIndex = require("./productIndex")(sequelize, DataTypes);
    const StoreProduct = require("./storeProduct")(sequelize, DataTypes);
    const Transfer = require("./Transfer")(sequelize, DataTypes);
    const Location = require("./Location")(sequelize, DataTypes);
    const TransferType = require("./TransferType")(sequelize, DataTypes);
    const TransferTypeReason = require("./TransferTypeReason")(sequelize, DataTypes);
    const status = require("./status")(sequelize, DataTypes);
    const User = require("./User")(sequelize,DataTypes);



    const TransferProductSchema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        transfer_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        from_store_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          to_store_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          type: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          reason_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    };

    const TransferProduct = sequelize.define("transfer_product", TransferProductSchema, {
        tableName: "transfer_product",
        sequelize,
        paranoid: true,
        freezeTableName: true,
        timestamps: true,
    });
    TransferProduct.belongsTo(productIndex, {
        as: "productIndex",
        foreignKey: "product_id",
        targetKey: "product_id",
    });
    TransferProduct.belongsTo(StoreProduct, {
        as: "storeProductDetail",
        foreignKey: "product_id",
    });
    
    TransferProduct.belongsTo(Transfer, {
        as: "transfer",
        foreignKey: "transfer_id",
    });
    TransferProduct.belongsTo(Location, {
        as: "from_location",
        foreignKey: ("from_store_id"),
    });
    TransferProduct.belongsTo(Location, {
        as: "to_location",
        foreignKey: ("to_store_id"),
    });
    TransferProduct.belongsTo(status, {
        as: "statusDetail",
        foreignKey: "status"
    })
    TransferProduct.belongsTo(User, {
        as: "userDetail",
        foreignKey: "created_by"
    })
    TransferProduct.belongsTo(TransferType, { as: "Type", foreignKey: "type" });

    TransferProduct.belongsTo(TransferTypeReason, { as: "transferReasonDetail", foreignKey: "reason_id" });

    return TransferProduct;
};
