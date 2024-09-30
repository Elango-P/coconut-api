"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store_product");
    if (tableDefinition && !tableDefinition["discrepancy_quantity"]) {
      await queryInterface.addColumn("store_product", "discrepancy_quantity", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store_product");
    if (tableDefinition && tableDefinition["store_product"]) {
      await queryInterface.removeColumn("store_product", "discrepancy_quantity");
    }
  },
};