module.exports = (sequelize, DataTypes) => {

  const BankSettlement = sequelize.define(
    "bank_settlement",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: true,
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
      tableName: "bank_settlement",
      timestamps: true,
      paranoid: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    }
  );

  return BankSettlement;
};
