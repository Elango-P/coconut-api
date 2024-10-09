module.exports = (sequelize, DataTypes) => {
  const AccountType = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    show_product: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_purchase: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_purchase_order: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_bill: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_loyalty: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_rating: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_file: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_payment: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_addresses: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_agreement: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_contact: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    show_custom_field: {
      type: DataTypes.BOOLEAN,
      allowNull: true, 
    },
    show_settings: {
      type: DataTypes.BOOLEAN,
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
  };
  const accountType = sequelize.define('account_type', AccountType, {
    tableName: 'account_type',
    sequelize,
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  });
  return accountType;
};
