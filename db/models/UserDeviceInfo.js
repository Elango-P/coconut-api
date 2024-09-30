
module.exports = (sequelize, DataTypes) => {
  const User = require("./User")(sequelize, DataTypes);

    const UserDevice = sequelize.define(
        "user_device_info",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
              },
              user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              company_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              ip_address: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              device_name: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              app_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              reset_mobile_data: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              brand_name: {
                type: DataTypes.STRING,
                allowNull: true
              },
              battery_percentage: {
                type: DataTypes.INTEGER, 
                allowNull: true
              },
              network_connection: {
                type: DataTypes.BOOLEAN,
                allowNull: true
              },
              created_at: {
                allowNull: true,
                type: DataTypes.DATE,
              },
              updated_at: {
                allowNull: true,
                type: DataTypes.DATE,
              },
              deleted_at: {
                allowNull: true,
                type: DataTypes.DATE,
              },
              version_number: {
                allowNull:true,
                type : DataTypes.STRING
              },
              unique_id: {
                type: DataTypes.STRING, 
                allowNull: true
              },
              status: {
                type: DataTypes.INTEGER, 
                allowNull: true
              },
              last_logged_in_at: {
                allowNull: true,
                type: DataTypes.DATE,
              },
        },
        {
            tableName: "user_device_info",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: false,
        }
        
    );
    UserDevice.belongsTo(User, {
      as: "userDetails",
      foreignKey: "user_id",
    });
    return UserDevice;
};
