exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_history table");

    // Defining whether the ticket_history table already exist or not.
    const ticketHistoryTableExists = await queryInterface.tableExists("ticket_history");

    // Condition for creating the ticket_history table only if the table doesn't exist already.
    if (!ticketHistoryTableExists) {
      await queryInterface.createTable("ticket_history", {
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
        field: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        original_value: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        new_value: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        comments: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        created_by: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        created_at: {
          allowNull: false,
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
    // Defining whether the ticket_history table already exist or not.
    const ticketHistoryTableExists = await queryInterface.tableExists("ticket_history");

    // Condition for dropping the ticket_history table only if the table exist already.
    if (ticketHistoryTableExists) {
      await queryInterface.dropTable("ticket_history");
    };
  } catch (err) {
    console.log(err);
  };
};
