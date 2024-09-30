'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && !tableDefinition["discount_percentage"]) {
      await queryInterface.addColumn("product", "discount_percentage", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["margin_percentage"]) {
      await queryInterface.addColumn("product", "margin_percentage", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && tableDefinition["discount_percentage"]) {
      await queryInterface.removeColumn("product", "discount_percentage");
    }
    if (tableDefinition && tableDefinition["margin_percentage"]) {
      await queryInterface.removeColumn("product", "margin_percentage");
    }
    
  },
};