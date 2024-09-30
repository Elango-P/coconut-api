
module.exports = (sequelize, DataTypes) => {
  
    const Schema = {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      location_allocation_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
    },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      shift_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
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
    };
  
    const LocationAllocationUser = sequelize.define("location_allocation_user", Schema, {
      sequelize,
      tableName: "location_allocation_user",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
      paranoid: true,
    });

    return LocationAllocationUser;
  };
  