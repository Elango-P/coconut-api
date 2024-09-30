"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_device_info");

    if (tableDefinition && !tableDefinition["status"]) {
      await queryInterface.addColumn("user_device_info", "status", {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_device_info");

    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("user_device_info", "status");
    }

  },
};