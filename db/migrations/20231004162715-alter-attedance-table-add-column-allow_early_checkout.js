"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance");
    if (tableDefinition && !tableDefinition["allow_early_checkout"]) {
      await queryInterface.addColumn("attendance", "allow_early_checkout", {
        type: Sequelize.BOOLEAN,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance");
    if (tableDefinition && tableDefinition["attendance"]) {
      await queryInterface.removeColumn("attendance", "allow_early_checkout");
    }
  },
};