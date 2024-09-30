exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_attachment table");

    // Defining whether the ticket_attachment table already exist or not.
    const ticketAttachmentTableExists = await queryInterface.tableExists("ticket_attachment");

    // Condition for creating the ticket_attachment table only if the table doesn't exist already.
    if (!ticketAttachmentTableExists) {
      await queryInterface.createTable("ticket_attachment", {
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
        page_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        platform: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        summary: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        media_name: {
          type: Sequelize.TEXT,
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
    // Defining whether the ticket_attachment table already exist or not.
    const ticketAttachmentTableExists = await queryInterface.tableExists("ticket_attachment");

    // Condition for dropping the ticket_attachment table only if the table exist already.
    if (ticketAttachmentTableExists) {
      await queryInterface.dropTable("ticket_attachment");
    };
  } catch (err) {
    console.log(err);
  };
};
