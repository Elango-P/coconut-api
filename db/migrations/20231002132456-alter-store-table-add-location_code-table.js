'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && !tableDefinition["location_code"]) {
      await queryInterface.addColumn("store", "location_code", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["last_order_number"]) {
      await queryInterface.addColumn("store", "last_order_number", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");
    if (tableDefinition && tableDefinition["location_code"]) {
      await queryInterface.removeColumn("store", "location_code");
    }
    if (tableDefinition && tableDefinition["last_order_number"]) {
      await queryInterface.removeColumn("store", "last_order_number");
    }
  },
};