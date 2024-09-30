"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");

    if (tableDefinition && tableDefinition["item"]) {
      return queryInterface.renameColumn(
        "ticket",
        "item",
        "ticket_number"
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("ticket");

    if (tableDefinition && tableDefinition["ticket_number"]) {
      return queryInterface.renameColumn("ticket", "ticket_number", "item");
    }
  },
};