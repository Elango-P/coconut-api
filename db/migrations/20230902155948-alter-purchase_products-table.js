'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && !tableDefinition["margin_percentage"]) {
      await queryInterface.addColumn("purchase_product", "margin_percentage", {
          type: Sequelize.NUMERIC,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && tableDefinition["margin_percentage"]) {
      await queryInterface.removeColumn("purchase_product", "margin_percentage");
    }
  },
}