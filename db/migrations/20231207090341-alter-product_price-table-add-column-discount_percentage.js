'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_price");
    if (tableDefinition && !tableDefinition["discount_percentage"]) {
      await queryInterface.addColumn("product_price", "discount_percentage", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["margin_percentage"]) {
      await queryInterface.addColumn("product_price", "margin_percentage", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_price");
    if (tableDefinition && tableDefinition["discount_percentage"]) {
      await queryInterface.removeColumn("product_price", "discount_percentage");
    }
    if (tableDefinition && tableDefinition["margin_percentage"]) {
      await queryInterface.removeColumn("product_price", "margin_percentage");
    }
    
  },
};