"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket_index");

    if (tableDefinition && tableDefinition["item"]) {
      return queryInterface.renameColumn(
        "ticket_index",
        "item",
        "ticket_number"
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket_index");

    if (tableDefinition && tableDefinition["ticket_number"]) {
      return queryInterface.renameColumn("ticket_index", "ticket_number", "item");
    }
  },
};