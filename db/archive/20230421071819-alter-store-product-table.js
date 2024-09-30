"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store_product");

    if (tableDefinition && !tableDefinition["order_quantity"]) {
      await queryInterface.addColumn("store_product", "order_quantity", {
        type: Sequelize.DECIMAL,
        allowNull: true
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store_product");

    if (tableDefinition && tableDefinition["order_quantity"]) {
      await queryInterface.removeColumn("store_product", "order_quantity");
    }

  },
};
