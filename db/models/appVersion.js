
module.exports = (sequelize, DataTypes) => {

    const AppVersion = sequelize.define(
        "app_version",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              company_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
              app_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              status: {
                type: DataTypes.INTEGER,
                allowNull: true,
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
        },
        {
            tableName: "app_version",
            timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt"
        }
    );


    return AppVersion;
};
