"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && tableDefinition["quantity"]) {
      await queryInterface.removeColumn("product", "quantity");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && !tableDefinition["quantity"]) {
      await queryInterface.addColumn("product", "quantity", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
