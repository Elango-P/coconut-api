'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && !tableDefinition["shopify_out_of_stock"]) {
        await queryInterface.addColumn("product", "shopify_out_of_stock", {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        });
    }

    if (tableDefinition && !tableDefinition["shopify_price"]) {
      await queryInterface.addColumn("product", "shopify_price", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && tableDefinition["shopify_out_of_stock"]) {
        await queryInterface.removeColumn("product", "shopify_out_of_stock");
    }

    if (tableDefinition && !tableDefinition["shopify_price"]) {
      await queryInterface.removeColumn("product", "shopify_price");
    }

  },
};
