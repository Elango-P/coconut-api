'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("bill");
    if (tableDefinition && !tableDefinition["expiry_returned_product_amount"]) {
      await queryInterface.addColumn("bill", "expiry_returned_product_amount", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("bill");
    if (tableDefinition && tableDefinition["expiry_returned_product_amount"]) {
      await queryInterface.removeColumn("bill", "expiry_returned_product_amount");
    }
  },
};
