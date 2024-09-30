"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_device_info");

    if (tableDefinition && !tableDefinition["unique_id"]) {
      await queryInterface.addColumn("user_device_info", "unique_id", {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_device_info");

    if (tableDefinition && tableDefinition["unique_id"]) {
      await queryInterface.removeColumn("user_device_info", "unique_id");
    }

  },
};