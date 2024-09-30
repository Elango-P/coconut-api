'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable(
          "stock_entry_product"
      );

      if (tableDefinition && tableDefinition["rack_number"]) {
          await queryInterface.removeColumn("stock_entry_product", "rack_number");
      }
  },
};


