module.exports = (sequelize, DataTypes) => {

    const tag = require("./Tag")(sequelize, DataTypes);

    const brandSchema = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        status: DataTypes.STRING,
        company_id:{ 
            type:DataTypes.INTEGER,
            allowNull:false
        },
        manufacture_id:DataTypes.INTEGER,
    };

    const brand = sequelize.define("product_brand", brandSchema, {
        sequelize,
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
    });

    brand.belongsTo(tag, {
        as: "tag",
        foreignKey: "manufacture_id",
    });

    return brand;
};
