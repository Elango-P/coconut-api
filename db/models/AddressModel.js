module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'address',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      address1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pin_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gst_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
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
      title: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'address',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      paranoid: true,
    }
  );

  return Address;
};
