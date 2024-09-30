exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_severity table");

    // Defining whether the ticket_severity table already exist or not.
    const ticketSeverityTableExists = await queryInterface.tableExists("ticket_severity");

    // Condition for creating the ticket_severity table only if the table doesn't exist already.
    if (!ticketSeverityTableExists) {
      await queryInterface.createTable("ticket_severity", {
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
          allowNull:false,
        }
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the ticket_severity table already exist or not.
    const ticketSeverityTableExists = await queryInterface.tableExists("ticket_severity");

    // Condition for dropping the ticket_severity table only if the table exist already.
    if (ticketSeverityTableExists) {
      await queryInterface.dropTable("ticket_severity");
    };
  } catch (err) {
    console.log(err);
  };
};
