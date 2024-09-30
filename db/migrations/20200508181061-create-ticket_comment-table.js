exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_comment table");

    // Defining whether the ticket_comment table already exist or not.
    const ticketCommentTableExists = await queryInterface.tableExists("ticket_comment");

    // Condition for creating the ticket_comment table only if the table doesn't exist already.
    if (!ticketCommentTableExists) {
      await queryInterface.createTable("ticket_comment", {
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
        comment: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        updated_by: {
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
        deletedAt: {
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
    // Defining whether the ticket_comment table already exist or not.
    const ticketCommentTableExists = await queryInterface.tableExists("ticket_comment");

    // Condition for dropping the ticket_comment table only if the table exist already.
    if (ticketCommentTableExists) {
      await queryInterface.dropTable("ticket_comment");
    };
  } catch (err) {
    console.log(err);
  };
};
