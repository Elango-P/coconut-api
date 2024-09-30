
module.exports = (sequelize, DataTypes) => {
	const status = require("./status")(sequelize, DataTypes);
  
    const Schema = {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        allowNull: true,
        type: DataTypes.DATEONLY,
    },
      status: {
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
  
    const LocationAllocation = sequelize.define('location_allocation', Schema, {
      sequelize,
      tableName: 'location_allocation',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      paranoid: true,
    });

    LocationAllocation.belongsTo(status, {
      as: "statusDetail",
      foreignKey: "status"
    })
  
    return LocationAllocation;
  };
  