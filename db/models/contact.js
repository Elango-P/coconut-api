module.exports = (sequelize, DataTypes) => {
  const objectModel = require('./objectModel')(sequelize, DataTypes);

  const Contact = sequelize.define(
    'contact',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      work_phone: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      object_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      object_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'contact',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      paranoid: true,
    }
  );

  return Contact;
};
