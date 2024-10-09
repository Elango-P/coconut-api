"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ticketTableDefinition = await queryInterface.describeTable("ticket");
    const ticketIndexTableDefinition = await queryInterface.describeTable("ticket_index");

    if (ticketTableDefinition && !ticketTableDefinition["from_location"]) {
      await queryInterface.addColumn("ticket", "from_location", {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (ticketTableDefinition && !ticketTableDefinition["to_location"]) {
      await queryInterface.addColumn("ticket", "to_location", {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (ticketIndexTableDefinition && !ticketIndexTableDefinition["from_location"]) {
      await queryInterface.addColumn("ticket_index", "from_location", {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (ticketIndexTableDefinition && !ticketIndexTableDefinition["to_location"]) {
      await queryInterface.addColumn("ticket_index", "to_location", {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const ticketTableDefinition = await queryInterface.describeTable("ticket");
    const ticketIndexTableDefinition = await queryInterface.describeTable("ticket_index");

    if (ticketTableDefinition && ticketTableDefinition["from_location"]) {
      await queryInterface.removeColumn("ticket", "from_location");
    }

    if (ticketTableDefinition && ticketTableDefinition["to_location"]) {
      await queryInterface.removeColumn("ticket", "to_location");
    }

    if (ticketIndexTableDefinition && ticketIndexTableDefinition["from_location"]) {
      await queryInterface.removeColumn("ticket_index", "from_location");
    }

    if (ticketIndexTableDefinition && ticketIndexTableDefinition["to_location"]) {
      await queryInterface.removeColumn("ticket_index", "to_location");
    }


  },
};