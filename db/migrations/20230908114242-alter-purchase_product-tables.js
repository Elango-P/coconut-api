'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && !tableDefinition["igst_percentage"]) {
      await queryInterface.addColumn("purchase_product", "igst_percentage", {
          type: Sequelize.NUMERIC,
          allowNull: true,
    
      });
    }
    if (tableDefinition && !tableDefinition["igst_amount"]) {
      await queryInterface.addColumn("purchase_product", "igst_amount", {
          type: Sequelize.NUMERIC,
          allowNull: true,
    
      });
    }
    if (tableDefinition && !tableDefinition["mrp"]) {
      await queryInterface.addColumn("purchase_product", "mrp", {
          type: Sequelize.NUMERIC,
          allowNull: true,
    
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && tableDefinition["igst_percentage"]) {
      await queryInterface.removeColumn("purchase_product", "igst_percentage");
    }
    if (tableDefinition && tableDefinition["igst_amount"]) {
      await queryInterface.removeColumn("purchase_product", "igst_amount");
    }
    if (tableDefinition && tableDefinition["mrp"]) {
      await queryInterface.removeColumn("purchase_product", "mrp");
    }
    
  },
};