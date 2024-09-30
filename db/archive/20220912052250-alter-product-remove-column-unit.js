"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && tableDefinition["unit"]) {
      await queryInterface.removeColumn("product", "unit");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && !tableDefinition["unit"]) {
      await queryInterface.addColumn("product", "unit", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
