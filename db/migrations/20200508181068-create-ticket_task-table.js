exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_task table");

    // Defining whether the ticket_task table already exist or not.
    const ticketTaskTableExists = await queryInterface.tableExists("ticket_task");

    // Condition for creating the ticket_task table only if the table doesn't exist already.
    if (!ticketTaskTableExists) {
      await queryInterface.createTable("ticket_task", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        summary: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        sort: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        system_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        estimated_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the ticket_task table already exist or not.
    const ticketTaskTableExists = await queryInterface.tableExists("ticket_task");

    // Condition for dropping the ticket_task table only if the table exist already.
    if (ticketTaskTableExists) {
      await queryInterface.dropTable("ticket_task");
    };
  } catch (err) {
    console.log(err);
  };
};
