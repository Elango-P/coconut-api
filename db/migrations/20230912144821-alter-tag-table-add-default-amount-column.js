"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("tag");
    if (tableDefinition && !tableDefinition["default_amount"]) {
      await queryInterface.addColumn("tag", "default_amount", {
        type: Sequelize.NUMERIC,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("tag");
    if (tableDefinition && tableDefinition["tag"]) {
      await queryInterface.removeColumn("tag", "default_amount");
    }
  },
};