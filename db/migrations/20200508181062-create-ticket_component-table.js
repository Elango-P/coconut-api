exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_component table");

    // Defining whether the ticket_component table already exist or not.
    const ticketComponentTableExists = await queryInterface.tableExists("ticket_component");

    // Condition for creating the ticket_component table only if the table doesn't exist already.
    if (!ticketComponentTableExists) {
      await queryInterface.createTable("ticket_component", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        sort: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
    // Defining whether the ticket_component table already exist or not.
    const ticketComponentTableExists = await queryInterface.tableExists("ticket_component");

    // Condition for dropping the ticket_component table only if the table exist already.
    if (ticketComponentTableExists) {
      await queryInterface.dropTable("ticket_component");
    };
  } catch (err) {
    console.log(err);
  };
};
