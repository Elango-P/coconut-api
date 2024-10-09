module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ticketTableDefinition = await queryInterface.describeTable("ticket");
    const ticketIndexTableDefinition = await queryInterface.describeTable("ticket_index");
    const projectTicketTypeTableDefinition = await queryInterface.describeTable("project_ticket_type");

    if (ticketTableDefinition && !ticketTableDefinition["initial_eta"]) {
      await queryInterface.addColumn("ticket", "initial_eta", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }

    if (ticketIndexTableDefinition && !ticketIndexTableDefinition["initial_eta"]) {
      await queryInterface.addColumn("ticket_index", "initial_eta", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }

    if (projectTicketTypeTableDefinition && !projectTicketTypeTableDefinition["fine_type"]) {
      await queryInterface.addColumn("project_ticket_type", "fine_type", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const ticketTableDefinition = await queryInterface.describeTable("ticket");
    const ticketIndexTableDefinition = await queryInterface.describeTable("ticket_index");
    const projectTicketTypeTableDefinition = await queryInterface.describeTable("project_ticket_type");


    if (ticketTableDefinition && ticketTableDefinition["initial_eta"]) {
      await queryInterface.removeColumn("ticket", "initial_eta");
    }

    if (ticketIndexTableDefinition && ticketIndexTableDefinition["initial_eta"]) {
      await queryInterface.removeColumn("ticket_index", "initial_eta");
    }

    if (projectTicketTypeTableDefinition && projectTicketTypeTableDefinition["fine_type"]) {
      await queryInterface.removeColumn("project_ticket_type", "fine_type");
    }
  
  
  },
};