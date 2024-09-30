'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && !tableDefinition["hsn_code"]) {
      await queryInterface.addColumn("product_index", "hsn_code", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && tableDefinition["hsn_code"]) {
      await queryInterface.removeColumn("product_index", "hsn_code");
    }
  },
};
