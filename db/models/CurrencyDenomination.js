module.exports = (sequelize, DataTypes) => {

    const CurrencyDenomination = sequelize.define(
      "currency_denomination",
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          object_name: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          object_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          denomination: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          amount: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          count: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          company_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          createdAt: {
            allowNull: false,
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
        tableName: "currency_denomination",
        timestamps: true,
        paranoid: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt",
      }
    );

  
    return CurrencyDenomination;
  };
  