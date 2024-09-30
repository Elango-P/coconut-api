'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && !tableDefinition["rack_number"]) {
      await queryInterface.addColumn("product", "rack_number", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && tableDefinition["rack_number"]) {
      await queryInterface.removeColumn("product", "rack_number");
    }
  },
};
