module.exports = (sequelize, DataTypes) => {

    const User = require("./User")(sequelize, DataTypes);

    const Location = require("./Location")(sequelize, DataTypes);

    const Tag = require("./Tag")(sequelize, DataTypes);

    const Inspection = sequelize.define("inspection", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    }, {
        tableName: "inspection",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt",
        paranoid: true,
    });

    Inspection.belongsTo(User, {
        as: "ownerDetail",
        foreignKey: "owner_id",
    });

    Inspection.belongsTo(Tag, {
        as: "tagDetail",
        foreignKey: "tag_id",
    });

    Inspection.belongsTo(Location, {
        as: "locationDetail",
        foreignKey: "store_id",
    });

    return Inspection;
};
