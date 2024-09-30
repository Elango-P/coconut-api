


module.exports = (sequelize, DataTypes) => {

    const user = require("./User")(sequelize, DataTypes);
    const shift = require("./Shift")(sequelize, DataTypes);
    const storeUser = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },

        store_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
       
        shift_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        company_id: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },

        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        type: {
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
    const StoreUser = sequelize.define("store_user", storeUser, {
        tableName: "store_user",
        sequelize,
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    });
    StoreUser.belongsTo(user, {
        as: "userDetail",
        sourceKey: "id",
        foreignKey: "user_id",
    });
    StoreUser.belongsTo(shift, {
        as: "shiftDetail",
        sourceKey: "id",
        foreignKey: "shift_id",
    });

    return StoreUser
}