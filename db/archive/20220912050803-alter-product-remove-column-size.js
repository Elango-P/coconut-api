"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && tableDefinition["size"]) {
      await queryInterface.removeColumn("product", "size");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && !tableDefinition["size"]) {
      await queryInterface.addColumn("product", "size", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};