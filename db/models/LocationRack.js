
module.exports = (sequelize, DataTypes) => {

    const LocationRack = sequelize.define(
        "location_rack",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            location_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            status: {
                allowNull: true,
                type: DataTypes.INTEGER,
              },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: true,
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
        },
        {
            tableName: "location_rack",
            timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt"
        }
    );
    return LocationRack
};
