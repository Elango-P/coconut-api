
module.exports = (sequelize, DataTypes) => {
  
      const messageChannel = sequelize.define(
          "message_channel",
          {
              id: {
                  type: DataTypes.INTEGER,
                  primaryKey: true,
                  autoIncrement: true,
                  allowNull: false,
                },
                name: {
                  type: DataTypes.STRING,
                  allowNull: true,
                },
                company_id: {
                  type: DataTypes.INTEGER,
                  allowNull: false,
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
          },
          {
              tableName: "message_channel",
              timestamps: true,
              paranoid: true,
              createdAt: "createdAt",
              updatedAt: "updatedAt",
              deletedAt: "deletedAt"
          }
      );

     
      return messageChannel;
  };
  