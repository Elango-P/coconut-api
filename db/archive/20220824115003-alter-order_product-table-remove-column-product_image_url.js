"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && tableDefinition["product_image_url"]) {
      await queryInterface.removeColumn("order_product", "product_image_url");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && !tableDefinition["product_image_url"]) {
      await queryInterface.addColumn("order_product", "product_image_url", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
