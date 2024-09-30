"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && !tableDefinition["update_product_price"]) {
      await queryInterface.addColumn("status", "update_product_price", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("status", "update_product_price");
    }
  },
};