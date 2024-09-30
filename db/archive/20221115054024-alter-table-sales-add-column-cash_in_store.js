"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sales");

    if (tableDefinition && !tableDefinition["cash_in_store"]) {
      await queryInterface.addColumn("sales", "cash_in_store", {
        type: Sequelize.INTEGER,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sales");

    if (tableDefinition && tableDefinition["cash_in_store"]) {
      await queryInterface.removeColumn("sales", "cash_in_store");
    }
  },
};
