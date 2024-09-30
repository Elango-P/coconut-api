module.exports = (sequelize, DataTypes) => {
    const company_user = sequelize.define(
        "company_user",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    );
    return company_user;
};
