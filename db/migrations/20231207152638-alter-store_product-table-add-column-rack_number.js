'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store_product");
    if (tableDefinition && !tableDefinition["rack_number"]) {
      await queryInterface.addColumn("store_product", "rack_number", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store_product");
    if (tableDefinition && tableDefinition["rack_number"]) {
      await queryInterface.removeColumn("store_product", "rack_number");
    }
  },
};
