module.exports = (sequelize, DataTypes) => {
  const User = require("./User")(sequelize, DataTypes);
  const status = require("./status")(sequelize, DataTypes);

  const TimeSheet = sequelize.define("timesheet", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
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
    timesheet_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_hours: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
  }, {
    tableName: "timesheet",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    deletedAt: "deletedAt",
    paranoid: true,
  });

  TimeSheet.belongsTo(User, { as: "user", foreignKey: "user_id" });
  TimeSheet.belongsTo(status, {
    as: "statusDetail",
    foreignKey: "status"
  })

  return TimeSheet;
};
