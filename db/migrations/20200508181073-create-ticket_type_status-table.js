exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_type_status table");

    // Defining whether the ticket_type_status table already exist or not.
    const ticketTypeStatusTableExists = await queryInterface.tableExists("ticket_type_status");

    // Condition for creating the ticket_type_status table only if the table doesn't exist already.
    if (!ticketTypeStatusTableExists) {
      await queryInterface.createTable("ticket_type_status", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        type_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        status_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the ticket_type_status table already exist or not.
    const ticketTypeStatusTableExists = await queryInterface.tableExists("ticket_type_status");

    // Condition for dropping the ticket_type_status table only if the table exist already.
    if (ticketTypeStatusTableExists) {
      await queryInterface.dropTable("ticket_type_status");
    };
  } catch (err) {
    console.log(err);
  };
};
