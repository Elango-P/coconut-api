exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log 
    console.log("Creating ticket_test_result table");

    // Defining whether the ticket_test_result table already exist or not.
    const ticketTestResultTableExists = await queryInterface.tableExists("ticket_test_result");

    // Condition for creating the ticket_test_result table only if the table doesn't exist already.
    if (!ticketTestResultTableExists) {
      await queryInterface.createTable("ticket_test_result", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        test_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        platform: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        reported_ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        sort: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: "0",
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
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the ticket_test_result table already exist or not.
    const ticketTestResultTableExists = await queryInterface.tableExists("ticket_test_result");

    // Condition for dropping the ticket_test_result table only if the table exist already.
    if (ticketTestResultTableExists) {
      await queryInterface.dropTable("ticket_test_result");
    };
  } catch (err) {
    console.log(err);
  };
};
