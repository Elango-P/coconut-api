'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && !tableDefinition["rack_number"]) {
      await queryInterface.addColumn("product_index", "rack_number", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && tableDefinition["rack_number"]) {
      await queryInterface.removeColumn("product_index", "rack_number");
    }
  },
};
