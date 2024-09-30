module.exports = (sequelize, DataTypes) => {
    const location = require("./Location")(sequelize, DataTypes);



    const TransferType = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        group: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        default_from_store: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        default_to_store: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        allow_to_change_from_store: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        offline_mode: {
            type: DataTypes.INTEGER,
            allowNull: true  
        },
        allow_to_change_to_store: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
        deletedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
        allowed_role_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        allowed_statuses: {
            type: DataTypes.STRING,
            allowNull: true
        },
        allow_replenishment: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    };
    const transferType = sequelize.define("transfer_type", TransferType, {
        tableName: "transfer_type",
        sequelize,
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    });
    transferType.belongsTo(location, {
        as: "location",
        sourceKey: "id",
        foreignKey: "default_from_store",
    });
    transferType.belongsTo(location, {
        as: "to_location",
        sourceKey: "id",
        foreignKey: "default_to_store",
    });


    return transferType;
};
