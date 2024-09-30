"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && !tableDefinition["status"]) {
      await queryInterface.addColumn("product_index", "status", {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: "Draft",
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("product_index", "status");
    }
  }
};

