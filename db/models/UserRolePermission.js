module.exports = (sequelize, DataTypes) => {
    const user_role_permission = sequelize.define(
        "user_role_permission",
        {
            role_id: {
                type: DataTypes.INTEGER,
            },
            role_permission: {
                type: DataTypes.STRING,
            },
            company_id: {
                type: DataTypes.INTEGER,
            },
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    );
    return user_role_permission;
};
