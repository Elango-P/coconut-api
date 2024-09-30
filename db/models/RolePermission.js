module.exports = (sequelize, DataTypes) => {
  const Role = require("./Role")(sequelize, DataTypes);
  const RolePermission = sequelize.define(
    "RolePermission",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      permission_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull:false
      },
    },
    {
      tableName: "role_permission",
      timestamps: false,
      paranoid: true,
    }
  );
  RolePermission.belongsTo(Role, { as: "role", foreignKey: "id" });
  return RolePermission;
};
