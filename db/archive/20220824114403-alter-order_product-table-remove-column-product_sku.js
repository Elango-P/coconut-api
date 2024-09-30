"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && tableDefinition["product_sku"]) {
      await queryInterface.removeColumn("order_product", "product_sku");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && !tableDefinition["product_sku"]) {
      await queryInterface.addColumn("order_product", "product_sku", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
