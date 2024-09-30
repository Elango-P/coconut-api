"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && !tableDefinition["location_product_last_stock_entry_date_update"]) {
      await queryInterface.addColumn("status", "location_product_last_stock_entry_date_update", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("status", "location_product_last_stock_entry_date_update");
    }
  },
};