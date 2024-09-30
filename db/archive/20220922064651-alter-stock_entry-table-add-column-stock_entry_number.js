"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry");

    if (tableDefinition && !tableDefinition["stock_entry_number"]) {
      await queryInterface.addColumn("stock_entry", "stock_entry_number", {
        type: Sequelize.INTEGER,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry");

    if (tableDefinition && tableDefinition["stock_entry_number"]) {
      await queryInterface.removeColumn("stock_entry", "stock_entry_number");
    }
  },
};
