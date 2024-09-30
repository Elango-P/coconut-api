"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && tableDefinition["product_category"]) {
      await queryInterface.removeColumn("order_product", "product_category");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && !tableDefinition["product_category"]) {
      await queryInterface.addColumn("order_product", "product_category", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
