module.exports =(sequelize, DataTypes) => {

    const tag = require("./Tag")(sequelize, DataTypes);


    const productTag = sequelize.define(
        "product_tag",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            company_id : {
                type: DataTypes.INTEGER,  
                allowNull: false
            },
            product_id: DataTypes.INTEGER,
            tag_id: DataTypes.INTEGER,
        },
        {
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
        }
    );

        productTag.belongsTo(tag, {
            as: "tag",
            foreignKey: "tag_id",
        });


    return productTag;
};
