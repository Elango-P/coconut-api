module.exports = (sequelize, DataTypes) => {
    const user_role = sequelize.define(
        "user_role",
        {
            role_name: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.STRING,
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull:false
            },
            allowed_shifts: {
                type: DataTypes.STRING,
            },
            allowed_locations: {
                type: DataTypes.STRING,
            },
            allowed_ip_address: {
                type: DataTypes.STRING,
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    );
    return user_role;
};
