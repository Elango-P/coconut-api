'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && !tableDefinition["update_in_transit_quantity"]) {
      await queryInterface.addColumn("status", "update_in_transit_quantity", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");
    if (tableDefinition && tableDefinition["update_in_transit_quantity"]) {
      await queryInterface.removeColumn("status", "update_in_transit_quantity");
    }
  },
};