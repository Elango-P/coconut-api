"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && !tableDefinition["validate_amount"]) {
      await queryInterface.addColumn("status", "validate_amount", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("status", "validate_amount");
    }
  },
};