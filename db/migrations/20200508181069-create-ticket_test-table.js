exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_test table");

    // Defining whether the ticket_test table already exist or not.
    const ticketTestTableExists = await queryInterface.tableExists("ticket_test");

    // Condition for creating the ticket_test table only if the table doesn't exist already.
    if (!ticketTestTableExists) {
      await queryInterface.createTable("ticket_test", {
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
        test_master_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        summary: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        feature: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        feature_action: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        sort: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: "0",
        },
        status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        test_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        action_status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        system_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        imported_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        excluded: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        priority: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        result: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        created_at: {
          allowNull: true,
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
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the ticket_test table already exist or not.
    const ticketTestTableExists = await queryInterface.tableExists("ticket_test");

    // Condition for dropping the ticket_test table only if the table exist already.
    if (ticketTestTableExists) {
      await queryInterface.dropTable("ticket_test");
    };
  } catch (err) {
    console.log(err);
  };
};
