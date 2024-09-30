"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && tableDefinition["quality"]) {
      return queryInterface.renameColumn(
        "order_product",
        "quality",
        "quantity"
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && tableDefinition["shopify_status"]) {
      return queryInterface.renameColumn("product", "quantity", "quality");
    }
  },
};
