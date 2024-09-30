exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_poa table");

    // Defining whether the ticket_poa table already exist or not.
    const ticketPoaTableExists = await queryInterface.tableExists("ticket_poa");

    // Condition for creating the ticket_poa table only if the table doesn't exist already.
    if (!ticketPoaTableExists) {
      await queryInterface.createTable("ticket_poa", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        details: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        attachments: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        updated_by: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        }
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the ticket_poa table already exist or not.
    const ticketPoaTableExists = await queryInterface.tableExists("ticket_poa");

    // Condition for dropping the ticket_poa table only if the table exist already.
    if (ticketPoaTableExists) {
      await queryInterface.dropTable("ticket_poa");
    };
  } catch (err) {
    console.log(err);
  };
};
