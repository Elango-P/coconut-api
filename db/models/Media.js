module.exports = (sequelize, DataTypes) => {
    const Tag = require("./Tag")(sequelize, DataTypes);

    const mediaSchema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        feature: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        object_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        object_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        visibility: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    };

    const Media = sequelize.define("media", mediaSchema, {
        sequelize,
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
    });

    Media.belongsTo(Tag, {
        as: "tagDetail",
        foreignKey: "tag_id",
    });

    return Media;
};
