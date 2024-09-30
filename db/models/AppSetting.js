
module.exports = (sequelize, DataTypes) => {

    const AppSetting = sequelize.define(
        "app_setting",
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
            value: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            app_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
            tableName: "app_setting",
            timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt"
        }
    );


    return AppSetting;
};
