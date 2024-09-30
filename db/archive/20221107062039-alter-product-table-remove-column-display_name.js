"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && tableDefinition["display_name"]) {
      await queryInterface.removeColumn("product", "display_name");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && !tableDefinition["display_name"]) {
      await queryInterface.addColumn("product", "display_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
