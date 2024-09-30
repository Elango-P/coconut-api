
module.exports = (sequelize, DataTypes) => {
    const User = require("./User")(sequelize, DataTypes);

    const userLocation = sequelize.define(
        "user_location",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            company_id: {
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
            created_at: {
                allowNull: true,
                type: DataTypes.DATE,
            },
            updated_at: {
                allowNull: true,
                type: DataTypes.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: DataTypes.DATE,
            },
        },
        {
            tableName: "user_location",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: false,
        }

    );
    userLocation.belongsTo(User, {
        as: "userDetails",
        foreignKey: "user_id",
    });
    return userLocation;
};
