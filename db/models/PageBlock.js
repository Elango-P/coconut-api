module.exports = (sequelize, DataTypes) => {

    const PageBlock = sequelize.define(
      "page_block",
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
          sort_order: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          type: {
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
        tableName: "page_block",
        timestamps: true,
        paranoid: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt",
      }
    );

  
    return PageBlock;
  };
  