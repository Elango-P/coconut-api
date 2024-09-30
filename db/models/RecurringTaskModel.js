module.exports = (sequelize, DataTypes) => {
  const User = require('./User')(sequelize, DataTypes);
  const Status = require('./status')(sequelize, DataTypes);
	const Project = require("./Project")(sequelize, DataTypes);
  const ProjectTicketType = require("./ProjectTicketType")(sequelize , DataTypes);
  const Account = require("./account")(sequelize , DataTypes);

  const taskSchema = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    summary: {
      type: DataTypes.TEXT,
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
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ticket_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    object_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    object_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  };

  const recurringTaskTable = sequelize.define('recurring_task', taskSchema, {
    sequelize,
    tableName: 'recurring_task',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    paranoid: true,
  });

  // user Association
  recurringTaskTable.belongsTo(User, {
  	as: "assignee",
  	foreignKey: "assignee_id",
  	targetKey: "id",
  });
  recurringTaskTable.belongsTo(Status, {
  	as: "statusDetail",
  	foreignKey:"status",
      sourceKey: "id",
  });

  recurringTaskTable.belongsTo(Project, { as: "projectDetail", foreignKey: "project_id" });
  recurringTaskTable.belongsTo(Account, { as: "accountDetail", foreignKey: "account_id" });
  recurringTaskTable.belongsTo(ProjectTicketType, {
		as: "ticketTypeDetail",
		foreignKey: "ticket_type_id",

	});
  return recurringTaskTable;
};
