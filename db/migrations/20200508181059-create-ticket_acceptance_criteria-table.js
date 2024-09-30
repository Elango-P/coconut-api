exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_acceptance_criteria table");

    // Defining whether the ticket_acceptance_criteria table already exist or not.
    const ticketAcceptanceCriteriaTableExists = await queryInterface.tableExists("ticket_acceptance_criteria");

    // Condition for creating the ticket_acceptance_criteria table only if the table doesn't exist already.
    if (!ticketAcceptanceCriteriaTableExists) {
      await queryInterface.createTable("ticket_acceptance_criteria", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        acceptance_criteria: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      });
    };    
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the ticket_acceptance_criteria table already exist or not.
    const ticketAcceptanceCriteriaTableExists = await queryInterface.tableExists("ticket_acceptance_criteria");

    // Condition for dropping the ticket_acceptance_criteria table only if the table exist already.
    if (ticketAcceptanceCriteriaTableExists) {
      await queryInterface.dropTable("ticket_acceptance_criteria");
    };
  } catch (err) {
    console.log(err);
  };
};
