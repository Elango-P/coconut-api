'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_product");
    if (tableDefinition && !tableDefinition["margin_amount"]) {
      await queryInterface.addColumn("account_product", "margin_amount", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_product");
    if (tableDefinition && tableDefinition["margin_amount"]) {
      await queryInterface.removeColumn("account_product", "margin_amount");
    }
    
  },
};