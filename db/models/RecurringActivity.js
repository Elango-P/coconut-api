
module.exports = (sequelize, DataTypes) => {
    const User = require('./User')(sequelize, DataTypes);
    const Status = require('./status')(sequelize, DataTypes);
    const ActivityType = require('./ActivityType')(sequelize, DataTypes);
    const UserRole = require("./UserRole")(sequelize, DataTypes);

  
    const taskSchema = {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      assignee_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      item: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      day: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      month: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      date: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activity_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      shift_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    };
  
    const recurringActivityTable = sequelize.define('recurring_activity', taskSchema, {
      sequelize,
      tableName: 'recurring_activity',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      paranoid: true,
    });
  
    // user Association
    recurringActivityTable.belongsTo(User, {
        as: "assignee",
        foreignKey: "assignee_id",
        targetKey: "id",
    });
    recurringActivityTable.belongsTo(Status, {
        as: "statusDetail",
        foreignKey:"status",
        sourceKey: "id",
    });
    recurringActivityTable.belongsTo(ActivityType, {
      as: "activityTypeDetail",
      foreignKey:"activity_type",
      sourceKey: "id",
  });

  recurringActivityTable.belongsTo(UserRole, {
    as: "roleData",
    foreignKey: "role_id",
  });
    return recurringActivityTable;
  };
  