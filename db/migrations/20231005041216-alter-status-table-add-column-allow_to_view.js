"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && !tableDefinition["allow_to_view"]) {
      await queryInterface.addColumn("status", "allow_to_view", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("status", "allow_to_view");
    }
  },
};