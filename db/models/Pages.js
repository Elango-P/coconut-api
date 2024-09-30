module.exports = (sequelize, DataTypes) => {
	const Status = require("./status")(sequelize, DataTypes);

    const pages = sequelize.define(
        "pages",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "pages",
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt",
        }
    );
    pages.belongsTo(Status, { as: "statusDetail", foreignKey: "status" });
    return pages;
}