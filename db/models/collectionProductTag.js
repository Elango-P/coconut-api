module.exports = (sequelize, DataTypes) => {

    const tag = require("./Tag")(sequelize, DataTypes);

    const collectionProductTag = sequelize.define(
        "collection_product_tag",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            collection_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            tag_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            company_id : {
                type: DataTypes.INTEGER,  
                allowNull: false
            },
        },
        {
            tableName: "collection_product_tag",
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
        }
    );

        collectionProductTag.belongsTo(tag, {
            as: "tag",
            foreignKey: "tag_id",
        });

    return collectionProductTag;
};
