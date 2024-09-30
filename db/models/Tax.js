module.exports = (sequelize, DataTypes) => {
  const Tag = require('./Tag')(sequelize, DataTypes);

  const tax = sequelize.define(
    'tax',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      object_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      object_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tax_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      amount: {
        type: DataTypes.NUMERIC,
        allowNull: true,
      },
      tax_amount: {
        type: DataTypes.NUMERIC,
        allowNull: true,
      },
      tax_percentage: {
        type: DataTypes.NUMERIC,
        allowNull: true,
      },
      
    },
    {
      tableName: 'tax',
      timestamps: true,
      paranoid: true,
    }
  );

  tax.belongsTo(Tag, {
    as: 'typeData',
    foreignKey: 'tax_type_id',
  });
  return tax
};
