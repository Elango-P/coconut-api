"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance");
    if (tableDefinition && !tableDefinition["allow_goal_missing"]) {
      await queryInterface.addColumn("attendance", "allow_goal_missing", {
        type: Sequelize.BOOLEAN,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance");
    if (tableDefinition && tableDefinition["attendance"]) {
      await queryInterface.removeColumn("attendance", "allow_goal_missing");
    }
  },
};