"use strict";
module.exports = (sequelize, DataTypes) => {
    const setting = sequelize.define(
        "setting",
        {
            name: DataTypes.STRING,
            value: DataTypes.TEXT,
            company_id: {
                type:DataTypes.INTEGER,
                 allowNull:false,
            },
            created_by: DataTypes.STRING,
            updated_by: DataTypes.STRING,
            object_id: DataTypes.INTEGER,
            object_name: DataTypes.STRING,
        },
        {
            freezeTableName: true,
            paranoid: true,
        }
    );
    return setting;
};
