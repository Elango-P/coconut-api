
module.exports = (sequelize, DataTypes) => {
  const User = require("./User")(sequelize, DataTypes);
  const shift = require("./Shift")(sequelize, DataTypes);
  const location = require("./Location")(sequelize, DataTypes);
  
    const Schema = {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      location_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      shift_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      preferred_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
  
    const PreferredLocation = sequelize.define('preferred_location', Schema, {
      sequelize,
      tableName: 'preferred_location',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      paranoid: true,
    });


    PreferredLocation.belongsTo(User, {
      as: "userDetail",
      foreignKey: "user_id"
    })


    PreferredLocation.belongsTo(shift, {
      as: "shiftDetail",
      foreignKey: "shift_id"
    })

    PreferredLocation.belongsTo(location, {
      as: "locationDetail",
      foreignKey: "location_id"
    })
  
  
    return PreferredLocation;
  };
  