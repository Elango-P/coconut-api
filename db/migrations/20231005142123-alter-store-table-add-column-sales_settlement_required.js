"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && !tableDefinition["sales_settlement_required"]) {
      await queryInterface.addColumn("store", "sales_settlement_required", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["store"]) {
      await queryInterface.removeColumn("store", "sales_settlement_required");
    }
  },
};