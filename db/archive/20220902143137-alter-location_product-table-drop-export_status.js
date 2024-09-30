"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("location_product");

    if (tableDefinition && tableDefinition["export_status"]) {
      await queryInterface.removeColumn("location_product", "export_status");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("location_product");

    if (tableDefinition && !tableDefinition["export_status"]) {
      await queryInterface.addColumn("location_product", "export_status", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
};
