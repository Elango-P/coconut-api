module.exports = (sequelize, DataTypes) => {

    const Media = require("./Media")(sequelize, DataTypes);
    
    const productMedia = sequelize.define(
        "product_media",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            product_id: DataTypes.INTEGER,
            media_id: DataTypes.INTEGER,
            feature: DataTypes.STRING,
            company_id : {
                type: DataTypes.INTEGER,  
                allowNull: false,
            },
            status:DataTypes.TEXT,
        },
        {
            tableName: "product_media",
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
        }
    );

        productMedia.belongsTo(Media, {
            as: "media",
            foreignKey: "media_id",
        });

    return productMedia;
};
