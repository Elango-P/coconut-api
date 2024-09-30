"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("recurring_activity");
    if (tableDefinition && !tableDefinition["role_id"]) {
      await queryInterface.addColumn("recurring_activity", "role_id", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("recurring_activity");
    if (tableDefinition && tableDefinition["recurring_activity"]) {
      await queryInterface.removeColumn("recurring_activity", "role_id");
    }
  },
};