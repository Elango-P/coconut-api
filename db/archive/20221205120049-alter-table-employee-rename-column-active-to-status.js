"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("employee");

    if (tableDefinition && tableDefinition["active"]) {
      return queryInterface.renameColumn(
        "employee",
        "active",
        "status"
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("employee");

    if (tableDefinition && tableDefinition["shopify_status"]) {
      return queryInterface.renameColumn("product", "status", "active");
    }
  },
};
