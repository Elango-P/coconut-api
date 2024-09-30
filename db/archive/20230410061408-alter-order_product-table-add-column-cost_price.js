"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && !tableDefinition["cost_price"]) {
      await queryInterface.addColumn("order_product", "cost_price", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["profit_amount"]) {
      await queryInterface.addColumn("order_product", "profit_amount", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && tableDefinition["cost_price"]) {
      await queryInterface.removeColumn("order_product", "cost_price");
    }
    if (tableDefinition && !tableDefinition["profit_amount"]) {
      await queryInterface.removeColumn("order_product", "profit_amount", {
       
      });
    }
  },
};