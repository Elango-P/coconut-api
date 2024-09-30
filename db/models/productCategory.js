module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "product_category",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING,
            status: DataTypes.STRING,
            allow_online: DataTypes.INTEGER,
            order_quantity: DataTypes.INTEGER,
            company_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
              },
        },
        {
            tableName: "product_category",
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
        }
    );
};
