"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && !tableDefinition["min_quantity"]) {
      await queryInterface.addColumn("product_index", "min_quantity", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && tableDefinition["min_quantity"]) {
      await queryInterface.removeColumn("product_index", "min_quantity");
    }
  }
};

