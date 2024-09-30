module.exports = (sequelize, DataTypes) =>{
  const Tag = require("./Tag")(sequelize, DataTypes);
	const status = require("./status")(sequelize, DataTypes);
  const paymentAccount = require("./PaymentAccount")(sequelize, DataTypes)
  const account = require("./account")(sequelize, DataTypes)
const AccountEntry = sequelize.define(
    "AccountEntry",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      payment_account: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bank_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.NUMERIC,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      category_tag_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      account: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },  
      account_entry_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bank_reference_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bill_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "account_entry",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  AccountEntry.belongsTo(status, {
		as: "statusDetail",
		foreignKey: "status"
	})

  AccountEntry.belongsTo(Tag, {
		as: "tagDetail",
		foreignKey: "category_tag_id"
	})
  AccountEntry.belongsTo(account, {
		as: "accountDetail",
		foreignKey: "account"
	})
  AccountEntry.belongsTo(paymentAccount, {
		as: "paymentAccountDetail",
		foreignKey: "payment_account"
	})

	return AccountEntry;
}

