module.exports = (sequelize, DataTypes) => {

  const CustomField = require("./CustomField")(sequelize, DataTypes);

  const CustomFieldValue = sequelize.define("custom_field_value", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    custom_field_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    object_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    object_name: {
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
  }, {
    tableName: "custom_field_value",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    deletedAt: "deletedAt",
    paranoid: true,
  });

  CustomFieldValue.belongsTo(CustomField, {
    as: "customFieldDetail",
    foreignKey: "custom_field_id",
});


  return CustomFieldValue;
};
