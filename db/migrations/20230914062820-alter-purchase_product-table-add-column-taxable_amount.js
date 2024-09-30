'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && !tableDefinition["taxable_amount"]) {
      await queryInterface.addColumn("purchase_product", "taxable_amount", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && tableDefinition["taxable_amount"]) {
      await queryInterface.removeColumn("purchase_product", "taxable_amount");
    }
  },
};