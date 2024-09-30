'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && !tableDefinition["manufacture_name"]) {
      await queryInterface.addColumn("product", "manufacture_name", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && tableDefinition["manufacture_name"]) {
      await queryInterface.removeColumn("product", "manufacture_name");
    }
  },
};

