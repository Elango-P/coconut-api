exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_test_result_attachment table");

    // Defining whether the ticket_test_result_attachment table already exist or not.
    const ticketTestResultAttachmentTableExists = await queryInterface.tableExists("ticket_test_result_attachment");

    // Condition for creating the ticket_test_result_attachment table only if the table doesn't exist already.
    if (!ticketTestResultAttachmentTableExists) {
      await queryInterface.createTable("ticket_test_result_attachment", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        test_result_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        page_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        summary: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        media_name: {
          type: Sequelize.TEXT,
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
    // Defining whether the ticket_test_result_attachment table already exist or not.
    const ticketTestResultAttachmentTableExists = await queryInterface.tableExists("ticket_test_result_attachment");

    // Condition for dropping the ticket_test_result_attachment table only if the table exist already.
    if (ticketTestResultAttachmentTableExists) {
      await queryInterface.dropTable("ticket_test_result_attachment");
    };
  } catch (err) {
    console.log(err);
  };
};
