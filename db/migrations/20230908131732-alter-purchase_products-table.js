'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && !tableDefinition["margin_amount"]) {
      await queryInterface.addColumn("purchase_product", "margin_amount", {
          type: Sequelize.NUMERIC,
          allowNull: true,
    
      });
    }
    
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && tableDefinition["margin_amount"]) {
      await queryInterface.removeColumn("purchase_product", "margin_amount");
    }
    
  },
};