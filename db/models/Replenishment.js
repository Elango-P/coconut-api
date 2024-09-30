module.exports = (sequelize, DataTypes) => {
    const productIndex = require("./productIndex")(sequelize, DataTypes);
    const UserIndex = require("./UserIndex")(sequelize, DataTypes);

    const Replenishment = sequelize.define(
        "Replenishment",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
            },
            product_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            store_count: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            order_quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            distribution_center_quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            owner_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: true,
            }
        },
        {
            tableName: "replenishment",
            timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
		    deletedAt: "deletedAt"
        }
    );

    Replenishment.hasOne(productIndex, {
        as: "productIndexDetail",
        foreignKey: "product_id",
        targetKey: "product_id",
    });

    Replenishment.belongsTo(UserIndex, {
        as: "userDetails",
        foreignKey: "owner_id",
        targetKey: "user_id",
    });

    return Replenishment;
};
