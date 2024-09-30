module.exports = (sequelize, DataTypes) => {
	const status = require("./status")(sequelize, DataTypes);
  const TimeSheet = require("./TimeSheet")(sequelize, DataTypes);
    const TimeSheetDetail = sequelize.define("timesheet_detail", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      timesheet_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      task: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      start_time: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      end_time: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      duration: {
        allowNull: true,
        type: DataTypes.DECIMAL,
      },
      status: {
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
    }, {
      tableName: "timesheet_detail",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
      paranoid: true,
    });

    TimeSheetDetail.belongsTo(status, {
      as: "statusDetail",
      foreignKey: "status"
  })
    TimeSheetDetail.belongsTo(TimeSheet, {
      as: "timeSheet",
      foreignKey: "timesheet_id"
  })
    return TimeSheetDetail;
  };
  