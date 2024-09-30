
module.exports = (sequelize, DataTypes) => {
  const status = require("./status")(sequelize, DataTypes);
  const User = require("./User")(sequelize, DataTypes);

  
    const lead = sequelize.define(
      'lead',
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
            mobile: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          date: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          owner_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
           designation: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          status: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          notes: {
            type: DataTypes.STRING,
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
      },
      {
        tableName: 'lead',
        timestamps: true,
        paranoid: true,
      }
    );

    lead.belongsTo(status, {
      as: "statusDetail",
      foreignKey: "status"
    })
    lead.belongsTo(User, {
      as: "userDetails",
      foreignKey: "owner_id"
    })
   
    return lead
  };
  