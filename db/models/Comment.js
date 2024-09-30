module.exports = (sequelize, DataTypes) => {
    const User = require("./User")(sequelize, DataTypes);

    const Comment = sequelize.define("comment", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        object_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_at:{
            type:DataTypes.DATE,
            allowNull:true
        },
        updated_at:{
            type:DataTypes.DATE,
            allowNull:true
        },
        deletedAt:{
            type:DataTypes.DATE,
            allowNull:true
        },
        object_name:{
            type:DataTypes.STRING,
            allowNull:true
        },
        user_ids:{
            type:DataTypes.STRING,
            allowNull:true
        },

    }, {
        tableName: "comment",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deletedAt",
    });
    Comment.belongsTo(User, {
        as: "updatedBy",
        foreignKey: "updated_by",
    });

    return Comment;
}
