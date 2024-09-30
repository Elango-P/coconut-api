"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && !tableDefinition["start_date"]) {
      await queryInterface.addColumn("store", "start_date", {
        type: Sequelize.DATE,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && tableDefinition["start_date"]) {
      await queryInterface.removeColumn("store", "start_date");
    }
  },
};
