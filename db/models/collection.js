module.exports = (sequelize, DataTypes) => {

    const collectionProductTag = require("./collectionProductTag")(sequelize, DataTypes);

    const collectionSchema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        collection_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},

    };

    const collection = sequelize.define("collection", collectionSchema, {
        sequelize,
        freezeTableName: true,
        timestamps: true,
        tableName: "collection",
    });

    // collection Association
        collection.hasMany(collectionProductTag, {
            as: "collectionProductTag",
            foreignKey: "collection_id",
            targetKey: "collection_id",
        });

    return collection;
};
