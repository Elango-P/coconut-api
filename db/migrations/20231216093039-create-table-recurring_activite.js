exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log('Creating recurring_activity table');

    // Defining whether the recurring_activity table already exist or not.
    const recurringActiviteTableExists = await queryInterface.tableExists('recurring_activity');

    // Condition for creating the recurring_activity table only if the table doesn't exist already.
    if (!recurringActiviteTableExists) {
      await queryInterface.createTable('recurring_activity', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        summary: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        assignee_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        type: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        item: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        day: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        month: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        date: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        activity_type: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the recurring_activity table already exist or not.
    const recurringActiviteTableExists = await queryInterface.tableExists('recurring_activity');

    // Condition for dropping the recurring_activity table only if the table exist already.
    if (recurringActiviteTableExists) {
      await queryInterface.dropTable('recurring_activity');
    }
  } catch (err) {
    console.log(err);
  }
};
