module.exports = (sequelize, DataTypes) => {
    const Slack = sequelize.define("Slack", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        object_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        object_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        slack_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        slack_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    }, {
        tableName: "slack",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt",
        paranoid: true,
    });

    return Slack;
}