
module.exports = (sequelize, DataTypes) => {

    const App = sequelize.define(
        "app",
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
            status: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            name_space: {
                type: DataTypes.STRING,
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
            tableName: "app",
            timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt"
        }
    );


    return App;
};
