module.exports = (sequelize, DataTypes) => {
  const User = require('./User')(sequelize, DataTypes);
  const status = require('./status')(sequelize, DataTypes);
  const account = require('./account')(sequelize, DataTypes);
  const PaymentAccount = require('./PaymentAccount')(sequelize, DataTypes);

  const Payment = sequelize.define(
    'payment',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
     
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      payment_account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bill_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      invoice_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'payment',
      timestamps: true,
      paranoid: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    }
  );
  Payment.belongsTo(User, { as: 'user', foreignKey: 'owner_id' });
  Payment.belongsTo(status, { as: 'statusDetail', foreignKey: 'status' });
  Payment.belongsTo(account, { as: 'accountDetail', foreignKey: 'account_id' });
  Payment.belongsTo(PaymentAccount, { as: 'paymentAccountDetail', foreignKey: 'payment_account_id' });
  return Payment;
};
