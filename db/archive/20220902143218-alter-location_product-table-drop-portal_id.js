"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("location_product");

    if (tableDefinition && tableDefinition["portal_id"]) {
      await queryInterface.removeColumn("location_product", "portal_id");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("location_product");

    if (tableDefinition && !tableDefinition["portal_id"]) {
      await queryInterface.addColumn("location_product", "portal_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
};
