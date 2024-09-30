"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && tableDefinition["product_name"]) {
      await queryInterface.removeColumn("order_product", "product_name");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && !tableDefinition["product_name"]) {
      await queryInterface.addColumn("order_product", "product_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
