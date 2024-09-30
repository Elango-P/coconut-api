"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && !tableDefinition["sell_out_of_stock"]) {
      await queryInterface.addColumn("product_index", "sell_out_of_stock", {
        type: Sequelize.INTEGER,
        allowNull : true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && tableDefinition["sell_out_of_stock"]) {
      await queryInterface.removeColumn("product_index", "sell_out_of_stock");
    }
  },
};
