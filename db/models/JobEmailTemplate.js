module.exports = (sequelize, DataTypes) =>
    sequelize.define(
        "JobEmailTemplate",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            company_id : {
                type: DataTypes.INTEGER,  
                allowNull: false
            },
        },
        {
            tableName: "jobs_email_template",
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: false,
            deletedAt: false,
        }
    );
