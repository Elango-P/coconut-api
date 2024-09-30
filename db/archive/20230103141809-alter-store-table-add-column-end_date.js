"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && !tableDefinition["end_date"]) {
      await queryInterface.addColumn("store", "end_date", {
        type: Sequelize.DATE,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && tableDefinition["end_date"]) {
      await queryInterface.removeColumn("store", "end_date");
    }
  },
};
