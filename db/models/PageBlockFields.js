
module.exports = (sequelize, DataTypes) => {
  
  const Media = require("./Media")(sequelize, DataTypes)
    const PageBlockFields = sequelize.define(
      "page_block_fields",
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          title: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          description: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          media_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          page_block_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          createdAt: {
            allowNull: true,
            type: DataTypes.DATE,
          },
          updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: DataTypes.DATE,
          },
      },
      {
        tableName: "page_block_fields",
        timestamps: true,
        paranoid: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt",
      }
    );

    PageBlockFields.belongsTo(Media, {
      as: "mediaDetail",
      foreignKey: "media_id",
  });

  
    return PageBlockFields;
  };
  