"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ticketTableDefinition = await queryInterface.describeTable("ticket");

    if (ticketTableDefinition && !ticketTableDefinition["developer_id"]) {
      await queryInterface.addColumn("ticket", "developer_id", {
        type: Sequelize.INTEGER
      });
    }

    if (ticketTableDefinition && !ticketTableDefinition["tester_id"]) {
      await queryInterface.addColumn("ticket", "tester_id", {
        type: Sequelize.INTEGER
      });
    }

    const ticketIndexTableDefinition = await queryInterface.describeTable("ticket_index");

    if (ticketIndexTableDefinition && !ticketIndexTableDefinition["developer_id"]) {
      await queryInterface.addColumn("ticket_index", "developer_id", {
        type: Sequelize.INTEGER
      });
    }

    if (ticketIndexTableDefinition && !ticketIndexTableDefinition["tester_id"]) {
      await queryInterface.addColumn("ticket_index", "tester_id", {
        type: Sequelize.INTEGER
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const ticketTableDefinition = await queryInterface.describeTable("ticket");

    if (ticketTableDefinition && ticketTableDefinition["ticket"]) {
      await queryInterface.removeColumn("ticket", "developer_id");
    }

    if (ticketTableDefinition && ticketTableDefinition["ticket"]) {
      await queryInterface.removeColumn("ticket", "tester_id");
    }


    const ticketIndexTableDefinition = await queryInterface.describeTable("ticket_index");

    if (ticketIndexTableDefinition && ticketIndexTableDefinition["ticket_index"]) {
      await queryInterface.removeColumn("ticket_index", "developer_id");
    }

    if (ticketIndexTableDefinition && ticketIndexTableDefinition["ticket_index"]) {
      await queryInterface.removeColumn("ticket_index", "tester_id");
    }
  },
};