
module.exports = (sequelize, DataTypes) => {
  const messageChannel = require("./messageChannel")(sequelize, DataTypes);
  
    const messageChannelUser = sequelize.define(
        "message_channel_user",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
              },
              status: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              channel_id: {
                type: DataTypes.INTEGER,
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
            tableName: "message_channel_user",
            timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt"
        }
    );
    messageChannelUser.belongsTo(messageChannel, {
      as: "messageChannelDetail",
      foreignKey: "channel_id",
    });
   
    return messageChannelUser;
};
