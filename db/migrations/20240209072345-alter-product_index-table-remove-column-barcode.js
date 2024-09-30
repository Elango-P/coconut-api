'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable(
          "product_index"
      );

      if (tableDefinition && tableDefinition["barcode"]) {
          await queryInterface.removeColumn("product_index", "barcode");
      }
  },
};


