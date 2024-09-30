module.exports = (sequelize, DataTypes) => {
    const OrderType = {
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
      group: {
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
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      show_customer_selection: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      
    };
    const orderType = sequelize.define('order_type', OrderType, {
      tableName: 'order_type',
      sequelize,
      freezeTableName: true,
      paranoid: true,
      timestamps: true,
    });
    return orderType;
  };
  